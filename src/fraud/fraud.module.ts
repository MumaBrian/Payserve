import { Module } from '@nestjs/common';
import { FraudService } from './fraud.service';
import { FraudController } from './fraud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraudAlert } from '../entities/fraud-alert.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { Account } from 'src/entities/account.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		NotificationsModule,
		AuthModule,
		TypeOrmModule.forFeature([FraudAlert, Transaction, Account]),
	],
	providers: [FraudService],
	controllers: [FraudController],
	exports: [FraudService],
})
export class FraudModule {}
