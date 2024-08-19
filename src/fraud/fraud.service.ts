import {
	Injectable,
	Logger,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FraudAlert } from '../entities/fraud-alert.entity';
import { Transaction } from '../entities/transaction.entity';
import { FraudAlertStatus } from '../entities/enums/fraud-alert-status.enum';
import { Users } from '../entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class FraudService {
	private readonly logger = new Logger(FraudService.name);

	constructor(
		@InjectRepository(FraudAlert)
		private fraudAlertRepository: Repository<FraudAlert>,
		private notificationService: NotificationsService,
	) {}

	async analyzeTransaction(transaction: Transaction): Promise<void> {
		const suspiciousPatterns = [
			{
				condition: (tx: Transaction) => tx.amount > 10000,
				alertType: 'Large Transaction',
				additionalInfo: `Transaction amount: ${transaction.amount}`,
			},
		];

		for (const pattern of suspiciousPatterns) {
			if (pattern.condition(transaction)) {
				try {
					const fraudAlert = await this.createFraudAlert(
						transaction,
						pattern.alertType,
						pattern.additionalInfo,
					);
					await this.notificationService.sendFraudAlert(
						transaction.user,
						fraudAlert.alertType,
					);
				} catch (error) {
					this.logger.error(
						`Failed to create fraud alert for transaction ${transaction.id}`,
						error.stack,
					);
					throw new InternalServerErrorException(
						'Failed to create fraud alert',
					);
				}
			}
		}
	}

	async createFraudAlert(
		transaction: Transaction,
		alertType: string,
		additionalInfo?: string,
	): Promise<FraudAlert> {
		try {
			const fraudAlert = this.fraudAlertRepository.create({
				alertType,
				status: FraudAlertStatus.PENDING,
				createdDate: new Date(),
				user: transaction.user,
				transaction,
				additionalInfo,
			});

			return await this.fraudAlertRepository.save(fraudAlert);
		} catch (error) {
			this.logger.error('Failed to save fraud alert', error.stack);
			throw new InternalServerErrorException(
				'Failed to save fraud alert',
			);
		}
	}

	async resolveFraudAlert(id: string): Promise<FraudAlert> {
		try {
			const fraudAlert = await this.fraudAlertRepository.findOneOrFail({
				where: { id },
			});

			fraudAlert.status = FraudAlertStatus.RESOLVED;
			fraudAlert.updatedDate = new Date();

			await this.fraudAlertRepository.save(fraudAlert);

			await this.notificationService.sendFraudAlert(
				fraudAlert.user,
				`Your fraud alert with ID ${id} has been resolved.`,
			);

			return fraudAlert;
		} catch (error) {
			this.logger.error(
				`Failed to resolve fraud alert ${id}`,
				error.stack,
			);
			throw new InternalServerErrorException(
				'Failed to resolve fraud alert',
			);
		}
	}

	async getPendingAlerts(): Promise<FraudAlert[]> {
		try {
			return await this.fraudAlertRepository.find({
				where: { status: FraudAlertStatus.PENDING },
			});
		} catch (error) {
			this.logger.error(
				'Failed to fetch pending fraud alerts',
				error.stack,
			);
			throw new InternalServerErrorException(
				'Failed to fetch pending fraud alerts',
			);
		}
	}

	async getAllAlertsForUser(user: Users): Promise<FraudAlert[]> {
		try {
			return await this.fraudAlertRepository.find({
				where: { user },
				relations: ['transaction'],
			});
		} catch (error) {
			this.logger.error(
				`Failed to fetch fraud alerts for user ${user.id}`,
				error.stack,
			);
			throw new InternalServerErrorException(
				'Failed to fetch fraud alerts',
			);
		}
	}

	async escalateFraudAlert(id: string): Promise<void> {
		const fraudAlert = await this.getFraudAlertById(id);
		this.logFraudAlertEscalation(fraudAlert);
	}

	private async getFraudAlertById(id: string): Promise<FraudAlert> {
		const fraudAlert = await this.fraudAlertRepository.findOne({
			where: { id },
		});
		if (!fraudAlert) {
			const errorMessage = `Attempted to escalate non-existent fraud alert: ${id}`;
			this.logger.warn(errorMessage);
			throw new NotFoundException('Fraud alert not found');
		}
		return fraudAlert;
	}

	private logFraudAlertEscalation(fraudAlert: FraudAlert) {
		if (fraudAlert) {
			const message = `Fraud alert escalated: ${fraudAlert.id}, alertType: ${fraudAlert.alertType}`;
			this.logger.warn(message);
		}
	}
}
