import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class ScheduleService {
	private readonly logger = new Logger(ScheduleService.name);

	constructor(private readonly transactionsService: TransactionsService) {}

	@Cron('*/5 * * * *') // Every 5 minutes
	async handleCron() {
		this.logger.debug('Checking for scheduled transactions to process...');
		await this.transactionsService.processScheduledTransactions();
	}
}
