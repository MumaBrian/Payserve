import {
	Controller,
	Post,
	Body,
	InternalServerErrorException,
	NotFoundException,
	UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from '../entities/notification.entity';
import { Users } from '../entities/user.entity';
import { NotificationType } from '../entities/enums/notification-type.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRole } from 'src/entities/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Post('create')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async createNotification(
		@Body()
		createNotificationDto: {
			user: Users;
			message: string;
			type: NotificationType;
		},
	): Promise<Notification> {
		try {
			const { user, message, type } = createNotificationDto;
			return await this.notificationsService.createNotification(
				user,
				message,
				type,
			);
		} catch (error) {
			throw new InternalServerErrorException(
				'Failed to create notification',
			);
		}
	}

	@Post('send')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async sendNotification(
		@Body()
		sendNotificationDto: {
			id: string; // Assuming ID of the notification to be sent
		},
	): Promise<void> {
		try {
			const notification =
				await this.notificationsService.findNotificationById(
					sendNotificationDto.id,
				); // You'll need to implement this method
			if (!notification) {
				throw new NotFoundException('Notification not found');
			}
			await this.notificationsService.sendNotification(notification);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new InternalServerErrorException(
				'Failed to send notification',
			);
		}
	}

	@Post('send-fraud-alert')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async sendFraudAlert(
		@Body() sendFraudAlertDto: { userId: string; message: string },
	): Promise<Notification> {
		try {
			const user = new Users(); // Replace with actual user lookup or DTO conversion
			user.id = sendFraudAlertDto.userId;
			return await this.notificationsService.sendFraudAlert(
				user,
				sendFraudAlertDto.message,
			);
		} catch (error) {
			throw new InternalServerErrorException(
				'Failed to send fraud alert',
			);
		}
	}
}
