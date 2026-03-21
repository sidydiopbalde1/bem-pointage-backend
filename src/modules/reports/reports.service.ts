import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { PrismaService } from '../../prisma/prisma.service';

interface ReportFilter {
  startDate: string;
  endDate: string;
  department?: string;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateAttendanceExcel(filter: ReportFilter): Promise<Buffer> {
    const attendances = await this.prisma.attendance.findMany({
      where: {
        date: { gte: new Date(filter.startDate), lte: new Date(filter.endDate) },
        ...(filter.department && { user: { department: filter.department } }),
      },
      include: {
        user: { select: { firstName: true, lastName: true, department: true, position: true } },
      },
      orderBy: [{ date: 'asc' }, { user: { lastName: 'asc' } }],
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Pointages');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Nom', key: 'lastName', width: 18 },
      { header: 'Prénom', key: 'firstName', width: 18 },
      { header: 'Département', key: 'department', width: 18 },
      { header: 'Poste', key: 'position', width: 20 },
      { header: 'Arrivée', key: 'checkIn', width: 12 },
      { header: 'Départ', key: 'checkOut', width: 12 },
      { header: 'Statut', key: 'status', width: 12 },
      { header: 'Type', key: 'type', width: 12 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2563EB' },
    };

    const formatTime = (date: Date | null) =>
      date
        ? new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        : '-';

    attendances.forEach((a) => {
      sheet.addRow({
        date: new Date(a.date).toLocaleDateString('fr-FR'),
        lastName: a.user.lastName,
        firstName: a.user.firstName,
        department: a.user.department ?? '-',
        position: a.user.position ?? '-',
        checkIn: formatTime(a.checkIn),
        checkOut: formatTime(a.checkOut),
        status: a.status,
        type: a.type,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async getMonthlyStats(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const [attendances, users] = await Promise.all([
      this.prisma.attendance.groupBy({
        by: ['userId', 'status'],
        where: { date: { gte: startDate, lte: endDate } },
        _count: true,
      }),
      this.prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, firstName: true, lastName: true, department: true },
      }),
    ]);

    return users.map((user) => {
      const userAttendances = attendances.filter((a) => a.userId === user.id);
      const present = userAttendances.find((a) => a.status === 'PRESENT')?._count ?? 0;
      const late = userAttendances.find((a) => a.status === 'LATE')?._count ?? 0;

      return { user, present, late, totalDays: present + late };
    });
  }
}
