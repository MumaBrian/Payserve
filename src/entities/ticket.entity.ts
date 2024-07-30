import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './user.entity';
import { TicketStatus } from './enums/ticket-status.enum';

@Entity()
export class Ticket {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	subject: string;

	@Column()
	description: string;

	@Column({ type: 'enum', enum: TicketStatus })
	status: TicketStatus;

	@Column()
	createdDate: Date;

	@ManyToOne(() => Users, (user) => user.tickets)
	user: Users;
}
