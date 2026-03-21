import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { Role } from '@prisma/client';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Exporter les pointages en Excel' })
  @ApiQuery({ name: 'startDate', example: '2026-03-01' })
  @ApiQuery({ name: 'endDate', example: '2026-03-31' })
  @ApiQuery({ name: 'department', required: false })
  @Get('attendance/export')
  async exportAttendance(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('department') department: string | undefined,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateAttendanceExcel({
      startDate,
      endDate,
      department,
    });

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="pointages-${startDate}-${endDate}.xlsx"`,
    });

    res.send(buffer);
  }

  @ApiOperation({ summary: 'Statistiques mensuelles' })
  @ApiQuery({ name: 'year', example: '2026' })
  @ApiQuery({ name: 'month', example: '3' })
  @Get('monthly-stats')
  getMonthlyStats(@Query('year') year: string, @Query('month') month: string) {
    return this.reportsService.getMonthlyStats(Number(year), Number(month));
  }
}
