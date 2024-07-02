import {
	Injectable,
	ConflictException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const { username, email } = createUserDto;
		const existingUser = await this.usersRepository.findOne({
			where: [{ username }, { email }],
		});

		if (existingUser) {
			throw new ConflictException('Username or email already exists');
		}

		const user = this.usersRepository.create(createUserDto);
		return this.usersRepository.save(user);
	}

	async findByUsername(username: string): Promise<User> {
		return this.usersRepository.findOne({ where: { username } });
	}

	async findById(id: number): Promise<User> {
		const user = await this.usersRepository.findOne({ where: { id: id } });
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}
}
