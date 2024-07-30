import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './user.entity';
import { Transaction } from './transaction.entity';
import { FraudAlertStatus } from './enums/fraud-alert-status.enum';

@Entity()
export class FraudAlert {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	alertType: string;

	@Column({ type: 'enum', enum: FraudAlertStatus })
	status: FraudAlertStatus;

	@Column()
	createdDate: Date;

	@ManyToOne(() => Users, (user) => user.fraudAlerts)
	user: Users;

	@ManyToOne(() => Transaction, (transaction) => transaction.fraudAlerts)
	transaction: Transaction;
}
