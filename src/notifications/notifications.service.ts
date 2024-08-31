import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { Users } from '../entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { NotificationStatus } from '../entities/enums/notification-status.enum';
import { NotificationType } from '../entities/enums/notification-type.enum';

@Injectable()
export class NotificationsService {
	private readonly logger = new Logger(NotificationsService.name);

	constructor(
		@InjectRepository(Notification)
		private notificationRepository: Repository<Notification>,
		private mailService: MailService,
	) {}

	async createNotification(
		user: Users,
		message: string,
		type: NotificationType,
	): Promise<Notification> {
		const notification = this.notificationRepository.create({
			message,
			type,
			user,
			status: NotificationStatus.PENDING,
			createdDate: new Date(),
		});

		return await this.notificationRepository.save(notification);
	}

	async sendNotification(notification: Notification): Promise<void> {
		try {
			if (notification.type === NotificationType.FRAUD_ALERT) {
				await this.mailService.sendAlert(
					notification.user.email,
					notification.message,
				);
			} else {
				// Handle other notification types (e.g., OTP, password reset)
			}

			notification.status = NotificationStatus.SENT;
			notification.sendDate = new Date();
			await this.notificationRepository.save(notification);
			this.logger.log(
				`Notification ${notification.id} sent successfully`,
			);
		} catch (error) {
			notification.status = NotificationStatus.FAILED;
			await this.notificationRepository.save(notification);
			this.logger.error(
				`Failed to send notification ${notification.id}: ${error.message}`,
			);
		}
	}

	async sendFraudAlert(user: Users, message: string): Promise<Notification> {
		const notification = await this.createNotification(
			user,
			message,
			NotificationType.FRAUD_ALERT,
		);
		await this.sendNotification(notification);
		return notification;
	}

	async findNotificationById(id: string): Promise<Notification | null> {
		return this.notificationRepository.findOne({
			where: { id },
		});
	}
}
