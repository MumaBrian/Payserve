import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './user.entity';
import { Account } from './account.entity';

@Entity()
export class Transfer {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	amount: number;

	@Column()
	date: Date;

	@ManyToOne(() => Users, (user) => user.transfers)
	user: Users;

	@ManyToOne(() => Account, (account) => account.transfersFrom)
	fromAccount: Account;

	@ManyToOne(() => Account, (account) => account.transfersTo)
	toAccount: Account;
}
