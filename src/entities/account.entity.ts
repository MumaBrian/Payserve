import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Users } from './user.entity';
import { AccountType } from './enums/account-type.enum';
import { Payment } from './payment.entity';
import { Transfer } from './transfer.entity';
import { Transaction } from './transaction.entity';
import { Schedule } from './schedule.entity';

@Entity()
export class Account {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ default: 0 })
	balance: number;

	@Column({ type: 'enum', enum: AccountType, default: AccountType.CHECKING })
	type: AccountType;

	@Column({ default: 'active' })
	status: string;

	@ManyToOne(() => Users, (user) => user.accounts)
	user: Users;

	@OneToMany(() => Payment, (payment) => payment.account)
	payments: Payment[];

	@OneToMany(() => Transfer, (transfer) => transfer.fromAccount)
	transfersFrom: Transfer[];

	@OneToMany(() => Transfer, (transfer) => transfer.toAccount)
	transfersTo: Transfer[];

	@OneToMany(() => Transaction, (transaction) => transaction.account)
	transactions: Transaction[];

	@Column({ nullable: true })
	overdraftLimit: number;

	@Column({ nullable: true })
	currency: string;

	@Column({ nullable: true })
	inactiveReason: string;

	@Column({ nullable: true, type: 'decimal' })
	interestRate: number;

	@OneToMany(() => Schedule, (schedule) => schedule.account)
	schedules: Schedule[];
}
