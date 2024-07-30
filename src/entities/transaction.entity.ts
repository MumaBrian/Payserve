import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Users } from './user.entity';
import { Account } from './account.entity';
import { FraudAlert } from './fraud-alert.entity';

@Entity()
export class Transaction {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	amount: number;

	@Column()
	category: string;

	@Column()
	date: Date;

	@ManyToOne(() => Users, (user) => user.transactions)
	user: Users;

	@ManyToOne(() => Account, (account) => account.transactions)
	account: Account;

	@OneToMany(() => FraudAlert, (fraudAlert) => fraudAlert.transaction)
	fraudAlerts: FraudAlert[];

	@Column()
	description: string;

	@Column({ default: 'pending' })
	status: string;

	@Column({ nullable: true })
	currency: string;

	@Column({ nullable: true, type: 'decimal' })
	exchangeRate: number;

	@Column({ nullable: true })
	counterparty: string;
}
