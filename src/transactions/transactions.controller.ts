import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ScheduleTransactionDto } from './dto/schedule-transaction.dto';
import { Users } from 'src/entities/user.entity';
import { User } from '../common/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/entities/enums/role.enum';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	async create(@Body() createTransactionDto: CreateTransactionDto) {
		return this.transactionsService.create(createTransactionDto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async findAll(@User() user: Users) {
		return this.transactionsService.findAll(user);
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async findOne(@Param('id') id: string, @User() user: Users) {
		return this.transactionsService.findOne(id, user);
	}

	@Post('schedule')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async scheduleTransaction(
		@Body() scheduleTransactionDto: ScheduleTransactionDto,
	) {
		return this.transactionsService.scheduleTransaction(
			scheduleTransactionDto,
		);
	}

	@Post('receive')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async handleReceiveMoney(
		@Body() createTransactionDto: CreateTransactionDto,
	) {
		return this.transactionsService.handleReceiveMoney(
			createTransactionDto,
		);
	}

	@Post('send')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async handleSendMoney(@Body() createTransactionDto: CreateTransactionDto) {
		return this.transactionsService.handleSendMoney(createTransactionDto);
	}
}
