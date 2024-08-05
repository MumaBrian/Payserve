import {
	IsNotEmpty,
	IsNumber,
	IsString,
	IsOptional,
	IsUUID,
	IsBoolean,
} from 'class-validator';

export class CreateTransactionDto {
	@IsNumber()
	@IsNotEmpty()
	amount: number;

	@IsString()
	@IsNotEmpty()
	category: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	currency?: string;

	@IsNumber()
	@IsOptional()
	exchangeRate?: number;

	@IsString()
	@IsOptional()
	counterparty?: string;

	@IsUUID()
	@IsNotEmpty()
	accountId: string;

	@IsString()
	@IsOptional()
	recurrenceInterval: string; // e.g., 'weekly', 'monthly'

	@IsBoolean()
	@IsOptional()
	isRecurring: boolean;
	@IsString()
	@IsOptional()
	baseCurrency: string; // e.g., 'USD'

	@IsString()
	@IsOptional()
	targetCurrency: string;
}
