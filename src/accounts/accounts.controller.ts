import {
	Controller,
	Post,
	Get,
	Param,
	Body,
	UseGuards,
	Patch,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { Users } from 'src/entities/user.entity';
import { User } from 'src/common/decorators/user.decorator';

@Controller('accounts')
export class AccountsController {
	constructor(private readonly accountsService: AccountsService) {}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	async create(
		@Body() createAccountDto: CreateAccountDto,
		@User() user: Users,
	) {
		return this.accountsService.create(createAccountDto, user);
	}

	@Get()
	async findAll() {
		return this.accountsService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.accountsService.findOne(+id);
	}

	@Patch('apply-interest')
	@UseGuards(AuthGuard('jwt'))
	async applyInterest() {
		await this.accountsService.applyInterest();
		return { message: 'Interest applied to all applicable accounts' };
	}

	@Patch(':id/handle-overdraft')
	@UseGuards(AuthGuard('jwt'))
	async handleOverdraft(
		@Param('id') id: string,
		@Body('amount') amount: number,
	) {
		await this.accountsService.handleOverdraft(+id, amount);
		return { message: 'Overdraft handled' };
	}

	@Patch(':id/enforce-transaction-limits')
	@UseGuards(AuthGuard('jwt'))
	async enforceTransactionLimits(
		@Param('id') id: string,
		@Body('amount') amount: number,
	) {
		await this.accountsService.enforceTransactionLimits(+id, amount);
		return { message: 'Transaction limits enforced' };
	}

	@Patch(':id/set-inactive')
	@UseGuards(AuthGuard('jwt'))
	async setInactive(@Param('id') id: string, @Body('reason') reason: string) {
		await this.accountsService.setInactive(+id, reason);
		return { message: 'Account set to inactive' };
	}
}
