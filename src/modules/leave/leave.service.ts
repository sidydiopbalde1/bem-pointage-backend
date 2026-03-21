import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LeaveStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeaveDto, ReviewLeaveDto } from './dto/leave.dto';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateLeaveDto) {
    if (new Date(dto.startDate) > new Date(dto.endDate)) {
      throw new BadRequestException(
        'La date de début doit être avant la date de fin',
      );
    }

    return this.prisma.leave.create({
      data: {
        userId,
        type: dto.type,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
      },
      include: {
        user: { select: { firstName: true, lastName: true, department: true } },
      },
    });
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

    return this.prisma.leave.update({
      where: { id: leaveId },
      data: { status: dto.status, reviewerId, reviewedAt: new Date() },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
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
