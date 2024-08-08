import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTransferDto {
	@IsUUID()
	@IsNotEmpty()
	fromAccountId: string;

	@IsUUID()
	@IsNotEmpty()
	toAccountId: string;

	@IsNumber()
	@IsNotEmpty()
	amount: number;

	@IsNotEmpty()
	description: string;

	@IsString()
	userId: string;

	date?: Date;
}
