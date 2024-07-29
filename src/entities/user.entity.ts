import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from './enums/role.enum';
import { Account } from './account.entity';
import { Transaction } from './transaction.entity';
import { Transfer } from './transfer.entity';
import { Payment } from './payment.entity';
import { FraudAlert } from './fraud-alert.entity';
import { Ticket } from './ticket.entity';
import { Notification } from './notification.entity';

@Entity()
export class Users {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@Column({ unique: true })
	email: string;

	@Column({ type: 'enum', enum: UserRole })
	roles: UserRole;

	@Column({ nullable: true, type: 'timestamp' })
	otpCreatedAt: Date;

	@Column({ nullable: true })
	otp: string;

	@Column({ default: false })
	isVerified: boolean;

	@Column({ nullable: true })
	refreshToken?: string;

	@Column({ nullable: true })
	resetToken?: string;

	@Column({ type: 'timestamp', nullable: true })
	resetTokenExpiry?: Date;

	@OneToMany(() => Account, (account) => account.user)
	accounts: Account[];

	@OneToMany(() => Transaction, (transaction) => transaction.user)
	transactions: Transaction[];

	@OneToMany(() => Transfer, (transfer) => transfer.user)
	transfers: Transfer[];

	@OneToMany(() => Payment, (payment) => payment.user)
	payments: Payment[];

	@OneToMany(() => FraudAlert, (fraudAlert) => fraudAlert.user)
	fraudAlerts: FraudAlert[];

	@OneToMany(() => Ticket, (ticket) => ticket.user)
	tickets: Ticket[];

	@OneToMany(() => Notification, (notification) => notification.user)
	notifications: Notification[];
}
