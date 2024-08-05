import axios from 'axios';
import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Users } from '../entities/user.entity';
import { Account } from '../entities/account.entity';
import { ScheduleTransactionDto } from './dto/schedule-transaction.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TransactionsService {
	constructor(
		@InjectRepository(Transaction)
		private transactionsRepository: Repository<Transaction>,
		@InjectRepository(Account)
		private accountsRepository: Repository<Account>,
	) {}

	async create(
		createTransactionDto: CreateTransactionDto,
	): Promise<Transaction> {
		const {
			amount,
			category,
			description,
			currency,
			exchangeRate,
			counterparty,
			accountId,
			isRecurring,
			recurrenceInterval,
			baseCurrency,
			targetCurrency,
		} = createTransactionDto;

		let conversionRate = exchangeRate;

		if (baseCurrency && targetCurrency && baseCurrency !== targetCurrency) {
			conversionRate = await this.getConversionRate(
				baseCurrency,
				targetCurrency,
			);
		}

		const account = await this.accountsRepository.findOne({
			where: { id: accountId },
		});

		if (account.balance < amount) {
			throw new BadRequestException('Insufficient funds');
		}

		const convertedAmount = amount * conversionRate;

		account.balance -= amount;
		await this.accountsRepository.save(account);

		const transaction = this.transactionsRepository.create({
			amount: convertedAmount,
			category,
			description,
			date: new Date(),
			status: 'completed',
			currency,
			exchangeRate,
			account,
			counterparty,
			isRecurring: isRecurring || false,
			recurrenceInterval,
			baseCurrency,
			targetCurrency,
			conversionRate,
		});

		return this.transactionsRepository.save(transaction);
	}

	async findAll(user: Users): Promise<Transaction[]> {
		return this.transactionsRepository.find({ where: { user } });
	}

	async findOne(id: string, user: Users): Promise<Transaction> {
		const transaction = await this.transactionsRepository.findOne({
			where: { id, user },
		});
		if (!transaction) {
			throw new NotFoundException('Transaction not found');
		}
		return transaction;
	}

	async scheduleTransaction(
		scheduleTransactionDto: ScheduleTransactionDto,
	): Promise<Transaction> {
		const {
			amount,
			category,
			description,
			currency,
			exchangeRate,
			counterparty,
			scheduledDate,
			accountId,
		} = scheduleTransactionDto;

		const account = await this.accountsRepository.findOne({
			where: { id: accountId },
			relations: ['user'],
		});

		const transaction = this.transactionsRepository.create({
			amount,
			category,
			description,
			date: scheduledDate,
			status: 'scheduled',
			currency,
			exchangeRate,
			account,
			user: account.user,
			counterparty,
		});

		return this.transactionsRepository.save(transaction);
	}

	async handleReceiveMoney(
		createTransactionDto: CreateTransactionDto,
	): Promise<Transaction> {
		const {
			amount,
			category,
			description,
			currency,
			exchangeRate,
			counterparty,
			accountId,
		} = createTransactionDto;

		const account = await this.accountsRepository.findOne({
			where: { id: accountId },
			relations: ['user'],
		});

		account.balance += amount;
		await this.accountsRepository.save(account);

		const transaction = this.transactionsRepository.create({
			amount,
			category,
			description,
			date: new Date(),
			status: 'completed',
			currency,
			exchangeRate,
			user: account.user,
			account,
			counterparty,
		});

		return this.transactionsRepository.save(transaction);
	}

	async handleSendMoney(
		createTransactionDto: CreateTransactionDto,
	): Promise<Transaction> {
		const {
			amount,
			category,
			description,
			currency,
			exchangeRate,
			counterparty,
			accountId,
		} = createTransactionDto;

		const account = await this.accountsRepository.findOne({
			where: { id: accountId },
			relations: ['user'],
		});

		if (account.balance < amount) {
			throw new BadRequestException('Insufficient funds');
		}

		account.balance -= amount;
		await this.accountsRepository.save(account);

		const transaction = this.transactionsRepository.create({
			amount,
			category,
			description,
			date: new Date(),
			status: 'completed',
			currency,
			exchangeRate,
			user: account.user,
			account,
			counterparty,
		});

		return this.transactionsRepository.save(transaction);
	}

	async processScheduledTransactions(): Promise<void> {
		const now = new Date();
		const transactions = await this.transactionsRepository.find({
			where: { status: 'scheduled', date: LessThanOrEqual(now) },
		});

		for (const transaction of transactions) {
			const account = await this.accountsRepository.findOne({
				where: { id: transaction.account.id },
			});
			if (account.balance >= transaction.amount) {
				account.balance -= transaction.amount;
				transaction.status = 'completed';
				await this.accountsRepository.save(account);
				await this.transactionsRepository.save(transaction);
			} else {
				transaction.status = 'failed';
				await this.transactionsRepository.save(transaction);
			}
		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async processRecurringTransactions(): Promise<void> {
		const transactions = await this.transactionsRepository.find({
			where: { isRecurring: true },
		});

		for (const transaction of transactions) {
			const account = await this.accountsRepository.findOne({
				where: { id: transaction.account.id },
			});
			if (account.balance >= transaction.amount) {
				account.balance -= transaction.amount;

				const newTransaction = this.transactionsRepository.create({
					...transaction,
					id: undefined, // Generate a new ID for the new transaction
					date: new Date(),
				});

				await this.accountsRepository.save(account);
				await this.transactionsRepository.save(newTransaction);
			} else {
				transaction.status = 'failed';
				await this.transactionsRepository.save(transaction);
			}
		}
	}

	private async getConversionRate(
		baseCurrency: string,
		targetCurrency: string,
	): Promise<number> {
		// Use an external API to get the conversion rate
		try {
			const response = await axios.get(
				`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
			);
			const rate = response.data.rates[targetCurrency];
			if (!rate) {
				throw new BadRequestException(
					`Conversion rate for ${baseCurrency} to ${targetCurrency} not found`,
				);
			}
			return rate;
		} catch (error) {
			throw new BadRequestException('Failed to retrieve conversion rate');
		}
	}
}
