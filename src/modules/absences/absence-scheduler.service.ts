import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { HolidaysService } from '../holidays/holidays.service';

@Injectable()
export class AbsenceSchedulerService {
  private readonly logger = new Logger(AbsenceSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly holidays: HolidaysService,
  ) {}

  /** Tourne à 23h55 chaque jour — marque absent tout actif qui n'a pas pointé */
  @Cron('55 23 * * *')
  async markDailyAbsences() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Vérifier si aujourd'hui est férié
    const isHoliday = (
      await this.holidays.getHolidayDatesInRange(today, today)
    ).length > 0;

    if (isHoliday) {
      this.logger.log(`Absence check skipped: ${today.toDateString()} is a public holiday`);
      return;
    }

    const dayOfWeek = today.getDay(); // 0=Dim, 1=Lun, ..., 6=Sam

    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, workDays: true },
    });

    let created = 0;

    for (const user of users) {
      const workDays = user.workDays
        .split(',')
        .map((d) => parseInt(d.trim(), 10));

      // Ce jour ne fait pas partie des jours de travail de cet utilisateur
      if (!workDays.includes(dayOfWeek)) continue;

      // Vérifier s'il a pointé aujourd'hui
      const attendance = await this.prisma.attendance.findUnique({
        where: { userId_date: { userId: user.id, date: today } },
      });
      if (attendance) continue;

      // Créer l'absence si elle n'existe pas déjà
      await this.prisma.absence.upsert({
        where: { userId_date: { userId: user.id, date: today } },
        create: { userId: user.id, date: today },
        update: {},
      });
      created++;
    }

    this.logger.log(`Daily absence check: ${created} absence(s) created for ${today.toDateString()}`);
  }
}
