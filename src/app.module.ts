import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransfersModule } from './transfers/transfers.module';
import { FraudModule } from './fraud/fraud.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AnalyticService } from './analytic/analytic.service';
import { SupportModule } from './support/support.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, AccountsModule, PaymentsModule, TransactionsModule, TransfersModule, FraudModule, AnalyticsModule, SupportModule, NotificationsModule, DatabaseModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, AnalyticService],
})
export class AppModule {}
