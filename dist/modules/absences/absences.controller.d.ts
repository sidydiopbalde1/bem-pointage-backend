import { AbsencesService } from './absences.service';
import { CloudinaryService } from './cloudinary.service';
import { JustifyAbsenceDto } from './dto/absence.dto';
export declare class AbsencesController {
    private readonly service;
    private readonly cloudinary;
    constructor(service: AbsencesService, cloudinary: CloudinaryService);
    justify(user: {
        id: string;
    }, dto: JustifyAbsenceDto, file?: Express.Multer.File): Promise<{
        date: Date;
        justification: string | null;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        justified: boolean;
        documentPath: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
    findMine(user: {
        id: string;
    }): import("@prisma/client").Prisma.PrismaPromise<{
        date: Date;
        justification: string | null;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        justified: boolean;
        documentPath: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }[]>;
    findAll(userId?: string, justified?: string): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            firstName: string;
            lastName: string;
            department: string | null;
        };
    } & {
        date: Date;
        justification: string | null;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        justified: boolean;
        documentPath: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    })[]>;
    review(id: string, reviewer: {
        id: string;
    }, justified: boolean): Promise<{
        user: {
            firstName: string;
            lastName: string;
        };
    } & {
        date: Date;
        justification: string | null;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        justified: boolean;
        documentPath: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
}
