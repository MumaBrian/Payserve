import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { NotificationType } from './enums/notification-type.enum';
import { NotificationStatus } from './enums/notification-status.enum';
@Entity()
export class Notification {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	message: string;

	@Column({ type: 'enum', enum: NotificationType })
	type: NotificationType;

	@Column({
		type: 'enum',
		enum: NotificationStatus,
		default: NotificationStatus.PENDING,
	})
	status: NotificationStatus;

	@CreateDateColumn()
	createdDate: Date;

	@Column({ nullable: true })
	sendDate: Date;

	@ManyToOne(() => Users, (user) => user.notifications)
	user: Users;
}
