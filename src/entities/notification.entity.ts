import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './user.entity';
import { NotificationType } from './enums/notification-type.enum';

@Entity()
export class Notification {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	message: string;

	@Column({ type: 'enum', enum: NotificationType })
	type: NotificationType;

	@Column({ default: 'pending' })
	status: string;

	@Column()
	createdDate: Date;

	@ManyToOne(() => Users, (user) => user.notifications)
	user: Users;
}
