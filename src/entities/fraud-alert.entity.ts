import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Transaction } from './transaction.entity';
import { FraudAlertStatus } from './enums/fraud-alert-status.enum';

@Entity()
export class FraudAlert {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	alertType: string; // e.g., 'Large Transaction', 'Unusual Activity'

	@Column({
		type: 'enum',
		enum: FraudAlertStatus,
		default: FraudAlertStatus.PENDING,
	})
	status: FraudAlertStatus;

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	updatedDate: Date;

	@ManyToOne(() => Users, (user) => user.fraudAlerts)
	user: Users;

	@ManyToOne(() => Transaction, (transaction) => transaction.fraudAlerts)
	transaction: Transaction;

	@Column({ nullable: true })
	additionalInfo: string; // Optional field to store more details about the alert
}
