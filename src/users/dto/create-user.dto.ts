import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;
}
