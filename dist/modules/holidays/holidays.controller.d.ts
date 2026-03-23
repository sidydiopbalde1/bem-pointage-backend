import { HolidaysService } from './holidays.service';
import { CreateHolidayDto, UpdateHolidayDto } from './dto/holiday.dto';
export declare class HolidaysController {
    private readonly service;
    constructor(service: HolidaysService);
    create(dto: CreateHolidayDto): Promise<{
        name: string;
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(year?: string): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    update(id: string, dto: UpdateHolidayDto): Promise<{
        name: string;
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
