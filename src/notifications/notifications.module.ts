import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from 'src/entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { AppConfigModule } from 'src/config/config.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		AppConfigModule,
		TypeOrmModule.forFeature([Notification]),
		AuthModule,
	],
	providers: [NotificationsService, MailService],
	controllers: [NotificationsController],
	exports: [NotificationsService],
})
export class NotificationsModule {}
