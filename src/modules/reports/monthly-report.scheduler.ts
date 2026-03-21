import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MonthlyReportScheduler {
  private readonly logger = new Logger(MonthlyReportScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // Le 1er de chaque mois à 8h00
  @Cron('0 8 1 * *')
  async sendMonthlyReports() {
    const now = new Date();
    // Rapport du mois précédent
    const reportDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const month = reportDate.getMonth() + 1;
    const year = reportDate.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    this.logger.log(`Envoi des rapports mensuels pour ${month}/${year}`);

    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, firstName: true, email: true },
    });

    // Nombre de jours ouvrables dans le mois (lun-ven)
    const workingDays = this.countWorkingDays(startDate, endDate);

    for (const user of users) {
      try {
        const attendances = await this.prisma.attendance.findMany({
          where: { userId: user.id, date: { gte: startDate, lte: endDate } },
          orderBy: { date: 'asc' },
        });

        const present = attendances.filter((a) => a.status === 'PRESENT').length;
        const late = attendances.filter((a) => a.status === 'LATE').length;
        const absent = Math.max(0, workingDays - (present + late));

        const totalHours = attendances.reduce((acc, a) => {
          if (a.checkOut) {
            return acc + (a.checkOut.getTime() - a.checkIn.getTime()) / 3600000;
          }
          return acc;
        }, 0);

        await this.mailService.sendMonthlyReport({
          to: user.email,
          firstName: user.firstName,
          month,
          year,
          stats: { workingDays, present, late, absent, totalHours },
          attendances: attendances.map((a) => ({
            date: a.date,
            checkIn: a.checkIn,
            checkOut: a.checkOut,
            status: a.status,
          })),
        });
      } catch (error) {
        this.logger.error(`Rapport mensuel échoué pour ${user.email}: ${(error as Error).message}`);
      }
    }

    this.logger.log(`Rapports mensuels envoyés à ${users.length} utilisateurs`);
  }

  private countWorkingDays(start: Date, end: Date): number {
    let count = 0;
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  }
}
