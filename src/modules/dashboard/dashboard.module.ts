import { Module } from '@nestjs/common';
import { DashboardGateway } from './dashboard.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [DashboardGateway],
  exports: [DashboardGateway],
})
export class DashboardModule {}
