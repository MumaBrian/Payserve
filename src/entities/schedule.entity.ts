import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './user.entity';
import { Account } from './account.entity';

@Entity()
export class Schedule {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	amount: number;

	@Column()
	category: string;

	@Column()
	description: string;

	@Column()
	currency: string;

	@Column()
	exchangeRate: number;

	@Column()
	counterparty: string;

	@Column()
	scheduledDate: Date;

	@Column({ default: 'pending' })
	status: string;

	@ManyToOne(() => Users, (user) => user.schedules)
	user: Users;

	@ManyToOne(() => Account, (account) => account.schedules)
	account: Account;
}
