import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './user.entity';
import { Account } from './account.entity';

@Entity()
export class Payment {
	@PrimaryGeneratedColumn('uuid')
	id: string;
	@Column()
	amount: number;

	@Column()
	recipient: string;

	@Column()
	date: Date;

	@ManyToOne(() => Users, (user) => user.payments)
	user: Users;

	@ManyToOne(() => Account, (account) => account.payments)
	account: Account;
}
