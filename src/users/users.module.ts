import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from 'src/entities/user.entity';
import { AuthController } from 'src/auth/auth.controller';
import { AuthModule } from 'src/auth/auth.module';
@Module({
	imports: [TypeOrmModule.forFeature([Users]), forwardRef(() => AuthModule)],
	controllers: [UsersController, AuthController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
