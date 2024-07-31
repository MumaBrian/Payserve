import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AuthModule } from 'src/auth/auth.module';
@Module({
	imports: [TypeOrmModule.forFeature([Account]), AuthModule],
	providers: [AccountsService],
	controllers: [AccountsController],
})
export class AccountsModule {}
