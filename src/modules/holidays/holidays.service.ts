import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHolidayDto, UpdateHolidayDto } from './dto/holiday.dto';

@Injectable()
export class HolidaysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHolidayDto) {
    const existing = await this.prisma.publicHoliday.findUnique({
      where: { date: new Date(dto.date) },
    });
    if (existing) {
      throw new ConflictException('Un jour férié existe déjà à cette date');
    }

    return this.prisma.publicHoliday.create({
      data: { date: new Date(dto.date), name: dto.name },
    });
  }

  findAll(year?: number) {
    if (year) {
      return this.prisma.publicHoliday.findMany({
        where: {
          date: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        },
        orderBy: { date: 'asc' },
      });
    }
    return this.prisma.publicHoliday.findMany({ orderBy: { date: 'asc' } });
  }

  async update(id: string, dto: UpdateHolidayDto) {
    const holiday = await this.prisma.publicHoliday.findUnique({ where: { id } });
    if (!holiday) throw new NotFoundException('Jour férié introuvable');

    return this.prisma.publicHoliday.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async remove(id: string) {
    const holiday = await this.prisma.publicHoliday.findUnique({ where: { id } });
    if (!holiday) throw new NotFoundException('Jour férié introuvable');

    await this.prisma.publicHoliday.delete({ where: { id } });
    return { message: 'Jour férié supprimé' };
  }

  /** Retourne les dates de jours fériés entre deux dates (pour calculs) */
  async getHolidayDatesInRange(start: Date, end: Date): Promise<Date[]> {
    const holidays = await this.prisma.publicHoliday.findMany({
      where: { date: { gte: start, lte: end } },
      select: { date: true },
    });
    return holidays.map((h) => h.date);
  }
}
