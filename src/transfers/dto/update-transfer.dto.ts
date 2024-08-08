import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

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
	description?: string;
}
