import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from 'src/entities/user.entity';
import { Account } from 'src/entities/account.entity';
import { FraudAlert } from 'src/entities/fraud-alert.entity';
import { Notification } from 'src/entities/notification.entity';
import { Payment } from 'src/entities/payment.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { Transfer } from 'src/entities/transfer.entity';
import { Schedule } from 'src/entities/schedule.entity';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('database.host'),
				port: configService.get<number>('database.port'),
				username: configService.get<string>('database.username'),
				password: configService.get<string>('database.password'),
				database: configService.get<string>('database.database'),
				entities: [
					Users,
					Account,
					FraudAlert,
					Notification,
					Payment,
					Ticket,
					Transaction,
					Transfer,
					Schedule,
				],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {}
