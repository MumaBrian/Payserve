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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRole } from 'src/entities/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
	constructor(private readonly accountsService: AccountsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	async create(@Body() createAccountDto: CreateAccountDto) {
		return this.accountsService.create(createAccountDto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@Roles(UserRole.Customer, UserRole.Admin)
	@ApiBearerAuth('authenticationToken')
	async findAll() {
		return this.accountsService.findAll();
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	async findOne(@Param('id') id: string) {
		return this.accountsService.findOne(id);
	}

	@Patch('apply-interest')
	@UseGuards(JwtAuthGuard)
	@Roles(UserRole.Customer, UserRole.Admin)
	@ApiBearerAuth('authenticationToken')
	async applyInterest() {
		await this.accountsService.applyInterest();
		return { message: 'Interest applied to all applicable accounts' };
	}

	@Patch(':id/handle-overdraft')
	@UseGuards(JwtAuthGuard)
	@Roles(UserRole.Customer, UserRole.Admin)
	@ApiBearerAuth('authenticationToken')
	async handleOverdraft(
		@Param('id') id: string,
		@Body('amount') amount: number,
	) {
		await this.accountsService.handleOverdraft(id, amount);
		return { message: 'Overdraft handled' };
	}

	@Patch(':id/enforce-transaction-limits')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async enforceTransactionLimits(
		@Param('id') id: string,
		@Body('amount') amount: number,
	) {
		await this.accountsService.enforceTransactionLimits(+id, amount);
		return { message: 'Transaction limits enforced' };
	}

	@Patch(':id/set-inactive')
	@UseGuards(JwtAuthGuard)
	@Roles(UserRole.Customer, UserRole.Admin)
	@ApiBearerAuth('authenticationToken')
	async setInactive(@Param('id') id: string, @Body('reason') reason: string) {
		await this.accountsService.setInactive(id, reason);
		return { message: 'Account set to inactive' };
	}
}
