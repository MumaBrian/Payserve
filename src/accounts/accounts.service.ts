import {
	Injectable,
	NotFoundException,
	ConflictException,
	BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { Users } from '../entities/user.entity';
import { AccountStatus } from 'src/entities/enums/account-type.enum';
@Injectable()
export class AccountsService {
	constructor(
		@InjectRepository(Account)
		private accountsRepository: Repository<Account>,
	) {}

	async create(
		createAccountDto: CreateAccountDto,
		user: Users,
	): Promise<Account> {
		const { balance, type, overdraftLimit, currency, interestRate } =
			createAccountDto;

		const account = this.accountsRepository.create({
			balance,
			type,
			status: AccountStatus.ACTIVE,
			overdraftLimit,
			currency,
			interestRate,
			user,
		});

		return this.accountsRepository.save(account);
	}

	async findAll(): Promise<Account[]> {
		return this.accountsRepository.find();
	}

	async findOne(id: number): Promise<Account> {
		const account = await this.accountsRepository.findOne({
			where: { id },
		});
		if (!account) {
			throw new NotFoundException('Account not found');
		}
		return account;
	}

	async applyInterest(): Promise<void> {
		const accounts = await this.accountsRepository.find({
			where: { interestRate: Not(IsNull()) },
		});
		for (const account of accounts) {
			const interest = account.balance * (account.interestRate / 100);
			account.balance += interest;
			await this.accountsRepository.save(account);
		}
	}

	async setInactive(accountId: number, reason: string): Promise<void> {
		const account = await this.findOne(accountId);
		account.status = 'inactive';
		account.inactiveReason = reason;
		await this.accountsRepository.save(account);
	}

	async handleOverdraft(accountId: number, amount: number): Promise<void> {
		const account = await this.findOne(accountId);
		if (account.balance + (account.overdraftLimit ?? 0) < amount) {
			throw new BadRequestException(
				'Insufficient funds, including overdraft limit',
			);
		}
		account.balance -= amount;
		await this.accountsRepository.save(account);
	}

	async enforceTransactionLimits(
		accountId: number,
		amount: number,
	): Promise<void> {
		const dailyLimit = 1000;
		const today = new Date().toISOString().split('T')[0];
		const transactions = await this.accountsRepository
			.createQueryBuilder('transaction')
			.where('transaction.accountId = :accountId', { accountId })
			.andWhere('transaction.date::date = :today', { today })
			.select('SUM(transaction.amount)', 'total')
			.getRawOne();

		if ((transactions.total ?? 0) + amount > dailyLimit) {
			throw new ConflictException('Daily transaction limit exceeded');
		}
	}
}
