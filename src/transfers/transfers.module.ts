import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from '../entities/transfer.entity';
import { Account } from '../entities/account.entity';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FraudModule } from 'src/fraud/fraud.module';
import { FraudAlert } from 'src/entities/fraud-alert.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Transfer, Account, FraudAlert]),
		AuthModule,
		FraudModule,
	],
	providers: [TransfersService],
	controllers: [TransfersController],
})
export class TransfersModule {}
