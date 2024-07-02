import {
	Injectable,
	UnauthorizedException,
	Inject,
	forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.usersService.findByUsername(username);
		if (user && (await bcrypt.compare(pass, user.password))) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(loginDto: LoginDto) {
		const user = await this.validateUser(
			loginDto.username,
			loginDto.password,
		);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = {
			username: user.username,
			sub: user.id,
			role: user.role,
		};
		const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

		return {
			accessToken,
			refreshToken,
		};
	}
}
