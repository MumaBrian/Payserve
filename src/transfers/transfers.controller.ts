import {
	Controller,
	Post,
	Get,
	Param,
	Body,
	UseGuards,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { BulkTransferDto } from './dto/bulk-transfer.dto';
import { Users } from '../entities/user.entity';
import { User } from '../common/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/entities/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
	constructor(private readonly transfersService: TransfersService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createTransferDto: CreateTransferDto) {
		return this.transfersService.create(createTransferDto);
	}

	@Post('/bulk')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Admin)
	@HttpCode(HttpStatus.CREATED)
	async createBulk(@Body() bulkTransferDto: BulkTransferDto) {
		return this.transfersService.createBulk(bulkTransferDto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async findAll(@User() user: Users) {
		return this.transfersService.findAll(user);
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('authenticationToken')
	@Roles(UserRole.Customer, UserRole.Admin)
	async findOne(@Param('id') id: string, @User() user: Users) {
		return this.transfersService.findOne(id, user);
	}
}
