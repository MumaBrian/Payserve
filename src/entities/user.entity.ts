import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './enums/role.enum';

@Entity()
export class User {
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
}
