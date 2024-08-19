import {
	Controller,
	Post,
	Get,
	Param,
	Body,
	InternalServerErrorException,
	NotFoundException,
	UseGuards,
} from '@nestjs/common';
import { FraudService } from './fraud.service';
import { FraudAlert } from '../entities/fraud-alert.entity';
import { Transaction } from '../entities/transaction.entity';
import { Users } from '../entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRole } from 'src/entities/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('fraud')
@Controller('fraud')
export class FraudController {
	constructor(private readonly fraudService: FraudService) {}

	@Post('analyze-transaction')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async analyzeTransaction(@Body() transaction: Transaction): Promise<void> {
		try {
			await this.fraudService.analyzeTransaction(transaction);
		} catch (error) {
			throw new InternalServerErrorException(
				'Failed to analyze transaction',
			);
		}
	}

	@Post('create-fraud-alert')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async createFraudAlert(
		@Body()
		createFraudAlertDto: {
			transaction: Transaction;
			alertType: string;
			additionalInfo?: string;
		},
	): Promise<FraudAlert> {
		try {
			const { transaction, alertType, additionalInfo } =
				createFraudAlertDto;
			return await this.fraudService.createFraudAlert(
				transaction,
				alertType,
				additionalInfo,
			);
		} catch (error) {
			throw new InternalServerErrorException(
				'Failed to create fraud alert',
			);
		}
	}

	@Get('resolve/:id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async resolveFraudAlert(@Param('id') id: string): Promise<FraudAlert> {
		try {
			return await this.fraudService.resolveFraudAlert(id);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException(
					`Fraud alert with ID ${id} not found`,
				);
			}
			throw new InternalServerErrorException(
				'Failed to resolve fraud alert',
			);
		}
	}

	@Get('pending-alerts')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async getPendingAlerts(): Promise<FraudAlert[]> {
		try {
			return await this.fraudService.getPendingAlerts();
		} catch (error) {
			throw new InternalServerErrorException(
				'Failed to fetch pending fraud alerts',
			);
		}
	}

	@Get('user-alerts/:userId')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async getAllAlertsForUser(
		@Param('userId') userId: string,
	): Promise<FraudAlert[]> {
		try {
			const user = new Users(); // Replace with actual user lookup or DTO conversion
			user.id = userId;
			return await this.fraudService.getAllAlertsForUser(user);
		} catch (error) {
			throw new InternalServerErrorException(
				'Failed to fetch fraud alerts for user',
			);
		}
	}

	@Post('escalate/:id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async escalateFraudAlert(@Param('id') id: string): Promise<void> {
		try {
			await this.fraudService.escalateFraudAlert(id);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException(
					`Fraud alert with ID ${id} not found`,
				);
			}
			throw new InternalServerErrorException(
				'Failed to escalate fraud alert',
			);
		}
	}
}
