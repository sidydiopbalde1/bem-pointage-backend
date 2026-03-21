import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { LeaveStatus, Role } from '@prisma/client';
import { LeaveService } from './leave.service';
import { CreateLeaveDto, ReviewLeaveDto } from './dto/leave.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Leaves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leaves')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @ApiOperation({ summary: 'Créer une demande de congé' })
  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateLeaveDto) {
    return this.leaveService.create(user.id, dto);
  }

  @ApiOperation({ summary: 'Mes demandes de congé' })
  @Get('my')
  findMine(@CurrentUser() user: { id: string }) {
    return this.leaveService.findAll(user.id);
  }

  @ApiOperation({ summary: 'Mes statistiques de congé' })
  @Get('my/stats')
  myStats(@CurrentUser() user: { id: string }) {
    return this.leaveService.getStats(user.id);
  }

  @ApiOperation({ summary: 'Lister toutes les demandes (ADMIN, MANAGER)' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
  })
  @UseGuards(RolesGuard)
  @Roles('ADMIN' as Role, 'MANAGER' as Role)
  @Get()
  findAll(@Query('status') status?: LeaveStatus) {
    return this.leaveService.findAll(undefined, status);
  }

  @ApiOperation({
    summary: 'Approuver ou rejeter une demande (ADMIN, MANAGER)',
  })
  @UseGuards(RolesGuard)
  @Roles('ADMIN' as Role, 'MANAGER' as Role)
  @Patch(':id/review')
  review(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: ReviewLeaveDto,
  ) {
    return this.leaveService.review(id, user.id, dto);
  }

  @ApiOperation({ summary: 'Annuler sa propre demande' })
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.leaveService.cancel(id, user.id);
  }
}
