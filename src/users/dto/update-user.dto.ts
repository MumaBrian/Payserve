import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from 'src/entities/enums/role.enum';

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	username?: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole;
}
