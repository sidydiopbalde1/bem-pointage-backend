import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceStatus, AttendanceType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QrCodeService } from '../qr-code/qr-code.service';
import { DashboardGateway } from '../dashboard/dashboard.gateway';
import { MailService } from '../mail/mail.service';
import { GeolocationService } from './geolocation.service';
import { CheckInDto, ManualAttendanceDto, AttendanceFilterDto } from './dto/attendance.dto';

const LATE_THRESHOLD_HOUR = 9;

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qrCodeService: QrCodeService,
    private readonly dashboardGateway: DashboardGateway,
    private readonly mailService: MailService,
    private readonly geolocationService: GeolocationService,
  ) {}

  private computeStatus(checkInTime: Date): AttendanceStatus {
    return checkInTime.getHours() >= LATE_THRESHOLD_HOUR
      ? AttendanceStatus.LATE
      : AttendanceStatus.PRESENT;
  }

  private todayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  async checkIn(userId: string, dto: CheckInDto) {
    // Vérification de présence sur place (uniquement pour le pointage manuel par l'employé)
    this.geolocationService.assertWithinOffice(dto.latitude, dto.longitude);
    return this.doCheckIn(userId, dto.type, dto.note);
  }

  private async doCheckIn(userId: string, type: AttendanceType, note?: string) {
    const date = this.todayDate();
    const now = new Date();

    const existing = await this.prisma.attendance.findUnique({
      where: { userId_date: { userId, date } },
    });
    if (existing) throw new BadRequestException("Pointage déjà effectué aujourd'hui");

    const status = this.computeStatus(now);

    const attendance = await this.prisma.attendance.create({
      data: { userId, date, checkIn: now, type, status, note },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, department: true } },
      },
    });

    this.dashboardGateway.emitAttendanceUpdate(attendance);

    // Notification de retard (non bloquant)
    if (status === AttendanceStatus.LATE) {
      const lateThreshold = new Date(now);
      lateThreshold.setHours(LATE_THRESHOLD_HOUR, 0, 0, 0);
      const minutesLate = Math.round((now.getTime() - lateThreshold.getTime()) / 60000);

      this.mailService
        .sendLateNotification({
          to: attendance.user.email,
          firstName: attendance.user.firstName,
          checkInTime: now,
          minutesLate,
        })
        .catch(() => null);
    }

    return attendance;
  }

  async checkOut(userId: string) {
    const date = this.todayDate();

    const attendance = await this.prisma.attendance.findUnique({
      where: { userId_date: { userId, date } },
    });

    if (!attendance) throw new NotFoundException("Aucun pointage d'entrée trouvé pour aujourd'hui");
    if (attendance.checkOut) throw new BadRequestException('Sortie déjà enregistrée');

    const updated = await this.prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut: new Date() },
      include: { user: { select: { firstName: true, lastName: true } } },
    });

    this.dashboardGateway.emitAttendanceUpdate(updated);
    return updated;
  }

  async scanQrCode(token: string) {
    const qrCode = await this.qrCodeService.findByToken(token);
    const date = this.todayDate();

    const existing = await this.prisma.attendance.findUnique({
      where: { userId_date: { userId: qrCode.userId, date } },
    });

    if (existing && !existing.checkOut) return this.checkOut(qrCode.userId);

    // Scan QR code = présence physique garantie par le dispositif, pas besoin de GPS
    return this.doCheckIn(qrCode.userId, AttendanceType.QR_CODE);
  }

  async createManual(dto: ManualAttendanceDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Employé introuvable');

    const date = new Date(dto.date);
    date.setHours(0, 0, 0, 0);

    return this.prisma.attendance.upsert({
      where: { userId_date: { userId: dto.userId, date } },
      update: {
        checkIn: new Date(dto.checkIn),
        checkOut: dto.checkOut ? new Date(dto.checkOut) : null,
        type: AttendanceType.MANUAL,
        note: dto.note,
      },
      create: {
        userId: dto.userId,
        date,
        checkIn: new Date(dto.checkIn),
        checkOut: dto.checkOut ? new Date(dto.checkOut) : null,
        type: AttendanceType.MANUAL,
        status: this.computeStatus(new Date(dto.checkIn)),
        note: dto.note,
      },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
  }

  findMine(userId: string) {
    return this.prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  findAll(filter: AttendanceFilterDto) {
    const { startDate, endDate, userId, department } = filter;

    return this.prisma.attendance.findMany({
      where: {
        ...(userId && { userId }),
        ...(startDate &&
          endDate && { date: { gte: new Date(startDate), lte: new Date(endDate) } }),
        ...(department && { user: { department } }),
      },
      include: {
        user: { select: { firstName: true, lastName: true, department: true, position: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getTodayStats() {
    const date = this.todayDate();
    const [total, present, late] = await Promise.all([
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.attendance.count({ where: { date, status: AttendanceStatus.PRESENT } }),
      this.prisma.attendance.count({ where: { date, status: AttendanceStatus.LATE } }),
    ]);

    return { total, present: present + late, late, absent: total - (present + late), date };
  }
}
