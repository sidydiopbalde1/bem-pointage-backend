import { Module } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { AbsencesController } from './absences.controller';
import { CloudinaryService } from './cloudinary.service';
import { AbsenceSchedulerService } from './absence-scheduler.service';
import { HolidaysModule } from '../holidays/holidays.module';

@Module({
  imports: [HolidaysModule],
  providers: [AbsencesService, CloudinaryService, AbsenceSchedulerService],
  controllers: [AbsencesController],
})
export class AbsencesModule {}
