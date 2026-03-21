import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { MonthlyReportScheduler } from './monthly-report.scheduler';

@Module({
  providers: [ReportsService, MonthlyReportScheduler],
  controllers: [ReportsController],
})
export class ReportsModule {}
