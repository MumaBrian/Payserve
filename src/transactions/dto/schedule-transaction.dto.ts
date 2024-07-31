import {
	IsNotEmpty,
	IsNumber,
	IsString,
	IsOptional,
	IsDate,
} from 'class-validator';

export class ScheduleTransactionDto {
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

	@IsDate()
	@IsNotEmpty()
	scheduledDate: Date;

	@IsString()
	@IsNotEmpty()
	accountId: string;
}
