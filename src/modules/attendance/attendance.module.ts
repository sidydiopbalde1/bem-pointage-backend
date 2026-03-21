import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { GeolocationService } from './geolocation.service';
import { QrCodeModule } from '../qr-code/qr-code.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [QrCodeModule, DashboardModule],
  providers: [AttendanceService, GeolocationService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
