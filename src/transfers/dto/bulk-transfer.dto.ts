import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTransferDto } from './create-transfer.dto';

export class BulkTransferDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateTransferDto)
	transfers: CreateTransferDto[];
}
