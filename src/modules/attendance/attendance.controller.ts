import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AttendanceService } from './attendance.service';
import { CheckInDto, ManualAttendanceDto, AttendanceFilterDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({ summary: 'Pointer l\'arrivée' })
  @Post('check-in')
  checkIn(@CurrentUser() user: { id: string }, @Body() dto: CheckInDto) {
    return this.attendanceService.checkIn(user.id, dto);
  }x

  @ApiOperation({ summary: 'Pointer la sortie' })
  @Post('check-out')
  checkOut(@CurrentUser() user: { id: string }) {
    return this.attendanceService.checkOut(user.id);
  }

  @ApiOperation({ summary: 'Scan QR code pour pointer' })
  @Post('scan/:token')
  scanQrCode(@Param('token') token: string) {
    return this.attendanceService.scanQrCode(token);
  }

  @ApiOperation({ summary: 'Créer un pointage manuel (ADMIN, MANAGER)' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Post('manual')
  createManual(@Body() dto: ManualAttendanceDto) {
    return this.attendanceService.createManual(dto);
  }

  @ApiOperation({ summary: 'Mes pointages (tout utilisateur connecté)' })
  @Get('my')
  findMine(@CurrentUser() user: { id: string }) {
    return this.attendanceService.findMine(user.id);
  }

  @ApiOperation({ summary: 'Lister les pointages (ADMIN, MANAGER)' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get()
  findAll(@Query() filter: AttendanceFilterDto) {
    return this.attendanceService.findAll(filter);
  }

  @ApiOperation({ summary: 'Statistiques du jour (ADMIN, MANAGER)' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('stats/today')
  getTodayStats() {
    return this.attendanceService.getTodayStats();
  }
}
