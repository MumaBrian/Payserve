import {
	IsNotEmpty,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { AccountType } from '../../entities/enums/account-type.enum';

export class CreateAccountDto {
	@IsNumber()
	@IsNotEmpty()
	balance: number;

	@IsEnum(AccountType)
	@IsNotEmpty()
	type: AccountType;

	@IsOptional()
	@IsNumber()
	overdraftLimit?: number;

	@IsOptional()
	@IsString()
	currency?: string;

	@IsOptional()
	@IsNumber()
	interestRate?: number;
}
