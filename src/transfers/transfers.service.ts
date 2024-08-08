import {
	Injectable,
	NotFoundException,
	BadRequestException,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, EntityManager } from 'typeorm';
import { Transfer } from '../entities/transfer.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Account } from '../entities/account.entity';
import { Users } from '../entities/user.entity';
import { BulkTransferDto } from './dto/bulk-transfer.dto';
import { FraudService } from 'src/fraud/fraud.service';

@Injectable()
export class TransfersService {
	private readonly logger = new Logger(TransfersService.name);

	constructor(
		@InjectRepository(Transfer)
		private transfersRepository: Repository<Transfer>,
		@InjectRepository(Account)
		private accountsRepository: Repository<Account>,
		private fraudDetectionService: FraudService,
		private connection: Connection, // For managing transactions
	) {}

	async createBulk(bulkTransferDto: BulkTransferDto): Promise<Transfer[]> {
		const results: Transfer[] = [];

		await this.connection.transaction(async (manager: EntityManager) => {
			for (const transfer of bulkTransferDto.transfers) {
				const result = await this.create(transfer, manager);
				results.push(result);
			}
		});

		return results;
	}

	async create(
		createTransferDto: CreateTransferDto,
		manager?: EntityManager,
	): Promise<Transfer> {
		const {
			fromAccountId,
			toAccountId,
			amount,
			date,
			description,
			userId,
		} = createTransferDto;

		const accountRepo = manager
			? manager.getRepository(Account)
			: this.accountsRepository;

		const fromAccount = await accountRepo.findOne({
			where: { id: fromAccountId },
			relations: ['user'],
		});
		const toAccount = await accountRepo.findOne({
			where: { id: toAccountId },
			relations: ['user'],
		});

		console.log({ userId });
		console.log({ fromAccount });
		if (!fromAccount || !toAccount) {
			this.logger.warn(
				`Transfer creation failed: Account not found. From: ${fromAccountId}, To: ${toAccountId}`,
			);
			throw new NotFoundException('Account not found');
		}

		if (fromAccount.user.id !== userId) {
			this.logger.warn(`Unauthorized transfer attempt by user ${userId}`);
			throw new BadRequestException(
				'You can only transfer from your own account',
			);
		}

		if (fromAccount.balance < amount) {
			this.logger.warn(
				`Insufficient funds in account ${fromAccountId} for user ${userId}`,
			);
			throw new BadRequestException('Insufficient funds');
		}

		fromAccount.balance -= amount;
		toAccount.balance += amount;

		await accountRepo.save([fromAccount, toAccount]);

		const transfer = this.transfersRepository.create({
			amount,
			description,
			fromAccount,
			toAccount,
			user: fromAccount.user,
			date: date || new Date(),
		});

		const savedTransfer = await this.transfersRepository.save(transfer);

		// Analyze the transfer for fraud after saving it
		try {
			await this.fraudDetectionService.analyzeTransaction(
				savedTransfer as any,
			);
		} catch (error) {
			this.logger.error(
				`Fraud detection failed for transfer ${savedTransfer.id}`,
				error.stack,
			);
			throw new InternalServerErrorException('Fraud detection failed');
		}

		return savedTransfer;
	}

	// async findAll(user: Users): Promise<Transfer[]> {
	// 	try {
	// 		return await this.transfersRepository.find({});
	// 	} catch (error) {
	// 		this.logger.error(
	// 			`Failed to fetch transfers for user ${user.id}`,
	// 			error.stack,
	// 		);
	// 		throw new InternalServerErrorException('Failed to fetch transfers');
	// 	}
	// }

	async findAll(user: Users): Promise<Transfer[]> {
		try {
			return await this.transfersRepository.find({
				relations: ['fromAccount', 'toAccount', 'user'],
				where: { user: { id: user.id } },
				order: { date: 'DESC' },
			});
		} catch (error) {
			this.logger.error(
				`Failed to fetch transfers for user ${user.id}`,
				error.stack,
			);
			throw new InternalServerErrorException('Failed to fetch transfers');
		}
	}

	async findOne(id: string, user: Users): Promise<Transfer> {
		try {
			const transfer = await this.transfersRepository.findOne({
				where: { id, user: { id: user.id } },
				relations: ['fromAccount', 'toAccount', 'user'],
			});
			if (!transfer) {
				this.logger.warn(
					`Transfer not found: ${id} for user ${user.id}`,
				);
				throw new NotFoundException('Transfer not found');
			}
			return transfer;
		} catch (error) {
			this.logger.error(
				`Failed to fetch transfer ${id} for user ${user.id}`,
				error.stack,
			);
			throw new InternalServerErrorException('Failed to fetch transfer');
		}
	}
}
