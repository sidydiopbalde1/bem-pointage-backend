import { HolidaysService } from './holidays.service';
import { CreateHolidayDto, UpdateHolidayDto } from './dto/holiday.dto';
export declare class HolidaysController {
    private readonly service;
    constructor(service: HolidaysService);
    create(dto: CreateHolidayDto): Promise<{
        id: string;
        date: Date;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(year?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        date: Date;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    update(id: string, dto: UpdateHolidayDto): Promise<{
        id: string;
        date: Date;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
