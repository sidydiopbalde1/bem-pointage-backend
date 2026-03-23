import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JustifyAbsenceDto } from './dto/absence.dto';

@Injectable()
export class AbsencesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Récupère ou crée une absence pour un utilisateur à une date */
  async justify(
    userId: string,
    dto: JustifyAbsenceDto,
    documentPath?: string,
  ) {
    const date = new Date(dto.date);

    // Vérifier qu'il n'y a pas de pointage ce jour (sinon pas une absence)
    const attendance = await this.prisma.attendance.findUnique({
      where: { userId_date: { userId, date } },
    });
    if (attendance) {
      throw new BadRequestException(
        'Un pointage existe déjà pour cette date, ce n\'est pas une absence',
      );
    }

    return this.prisma.absence.upsert({
      where: { userId_date: { userId, date } },
      create: {
        userId,
        date,
        justification: dto.justification,
        documentPath: documentPath ?? null,
      },
      update: {
        justification: dto.justification,
        ...(documentPath && { documentPath }),
      },
    });
  }

  findMine(userId: string) {
    return this.prisma.absence.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  findAll(userId?: string, justified?: boolean) {
    return this.prisma.absence.findMany({
      where: {
        ...(userId && { userId }),
        ...(justified !== undefined && { justified }),
      },
      include: {
        user: { select: { firstName: true, lastName: true, department: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async review(id: string, reviewerId: string, justified: boolean) {
    const absence = await this.prisma.absence.findUnique({ where: { id } });
    if (!absence) throw new NotFoundException('Absence introuvable');

    return this.prisma.absence.update({
      where: { id },
      data: { justified, reviewedBy: reviewerId, reviewedAt: new Date() },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });
  }
}
