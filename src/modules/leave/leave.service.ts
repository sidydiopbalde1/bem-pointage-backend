import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LeaveStatus, Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { HolidaysService } from '../holidays/holidays.service';
import { CreateLeaveDto, ReviewLeaveDto } from './dto/leave.dto';

@Injectable()
export class LeaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly holidays: HolidaysService,
  ) {}

  /** Calcule le nombre de jours ouvrables entre deux dates (sans weekends ni jours fériés) */
  private async countWorkingDays(start: Date, end: Date): Promise<number> {
    const holidayDates = await this.holidays.getHolidayDatesInRange(start, end);
    const holidayStrings = new Set(
      holidayDates.map((d) => d.toISOString().slice(0, 10)),
    );

    let count = 0;
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay(); // 0=dim, 6=sam
      const iso = current.toISOString().slice(0, 10);
      if (day !== 0 && day !== 6 && !holidayStrings.has(iso)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  async create(userId: string, dto: CreateLeaveDto) {
    if (new Date(dto.startDate) > new Date(dto.endDate)) {
      throw new BadRequestException(
        'La date de début doit être avant la date de fin',
      );
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const workingDays = await this.countWorkingDays(startDate, endDate);

    if (workingDays === 0) {
      throw new BadRequestException(
        'La période sélectionnée ne contient aucun jour ouvrable (weekends/jours fériés)',
      );
    }

    const leave = await this.prisma.leave.create({
      data: {
        userId,
        type: dto.type,
        startDate,
        endDate,
        reason: dto.reason,
      },
      include: {
        user: { select: { firstName: true, lastName: true, department: true } },
      },
    });

    // Notifier les admins
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN, isActive: true },
      select: { email: true },
    });

    await Promise.all(
      admins.map((admin) =>
        this.mail.sendLeaveRequestToAdmin({
          adminEmail: admin.email,
          employeeFirstName: leave.user.firstName,
          employeeLastName: leave.user.lastName,
          department: leave.user.department,
          type: leave.type,
          startDate: leave.startDate,
          endDate: leave.endDate,
          reason: leave.reason,
        }),
      ),
    );

    return { ...leave, workingDays };
  }

  findAll(userId?: string, status?: LeaveStatus) {
    return this.prisma.leave.findMany({
      where: {
        ...(userId && { userId }),
        ...(status && { status }),
      },
      include: {
        user: { select: { firstName: true, lastName: true, department: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async review(leaveId: string, reviewerId: string, dto: ReviewLeaveDto) {
    const leave = await this.prisma.leave.findUnique({
      where: { id: leaveId },
    });

    if (!leave) throw new NotFoundException('Demande introuvable');
    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Cette demande a déjà été traitée');
    }

    const updated = await this.prisma.leave.update({
      where: { id: leaveId },
      data: { status: dto.status, reviewerId, reviewedAt: new Date() },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    await this.mail.sendLeaveReviewToEmployee({
      to: updated.user.email,
      firstName: updated.user.firstName,
      type: updated.type,
      startDate: updated.startDate,
      endDate: updated.endDate,
      status: updated.status as 'APPROVED' | 'REJECTED',
    });

    return updated;
  }

  async cancel(leaveId: string, userId: string) {
    const leave = await this.prisma.leave.findFirst({
      where: { id: leaveId, userId },
    });

    if (!leave) throw new NotFoundException('Demande introuvable');
    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException(
        'Seules les demandes en attente peuvent être annulées',
      );
    }

    return this.prisma.leave.update({
      where: { id: leaveId },
      data: { status: LeaveStatus.CANCELLED },
    });
  }

  getStats(userId: string) {
    return this.prisma.leave.groupBy({
      by: ['type', 'status'],
      where: { userId, status: LeaveStatus.APPROVED },
      _count: true,
    });
  }
}
