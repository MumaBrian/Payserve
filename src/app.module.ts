import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransfersModule } from './transfers/transfers.module';
import { FraudModule } from './fraud/fraud.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SupportModule } from './support/support.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { CacheModule } from './cache/cache.module';
import { MailModule } from './mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AppConfigModule } from './config/config.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
	imports: [
		AppConfigModule,
		AuthModule,
		AccountsModule,
		PaymentsModule,
		TransactionsModule,
		TransfersModule,
		FraudModule,
		AnalyticsModule,
		SupportModule,
		NotificationsModule,
		DatabaseModule,
		UsersModule,
		CacheModule,
		MailModule,
		ThrottlerModule.forRoot([
			{
				ttl: 60,
				limit: 10,
			},
		]),
		ScheduleModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
