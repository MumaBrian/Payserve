import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { TransactionsModule } from '../transactions/transactions.module';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '../entities/schedule.entity';
import { Account } from '../entities/account.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { FraudModule } from 'src/fraud/fraud.module';

@Module({
	imports: [
		NestScheduleModule.forRoot(),
		TransactionsModule,
		TypeOrmModule.forFeature([Schedule, Account, Transaction]),
		FraudModule,
	],
	providers: [ScheduleService, TransactionsService],
})
export class ScheduleModule {}
