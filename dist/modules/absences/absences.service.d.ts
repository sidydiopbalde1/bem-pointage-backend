import { PrismaService } from '../../prisma/prisma.service';
import { JustifyAbsenceDto } from './dto/absence.dto';
export declare class AbsencesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    justify(userId: string, dto: JustifyAbsenceDto, documentPath?: string): Promise<{
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        reviewedAt: Date | null;
        justification: string | null;
        justified: boolean;
        documentPath: string | null;
        reviewedBy: string | null;
    }>;
    findMine(userId: string): import("@prisma/client").Prisma.PrismaPromise<{
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        reviewedAt: Date | null;
        justification: string | null;
        justified: boolean;
        documentPath: string | null;
        reviewedBy: string | null;
    }[]>;
    findAll(userId?: string, justified?: boolean): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            firstName: string;
            lastName: string;
            department: string | null;
        };
    } & {
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        reviewedAt: Date | null;
        justification: string | null;
        justified: boolean;
        documentPath: string | null;
        reviewedBy: string | null;
    })[]>;
    review(id: string, reviewerId: string, justified: boolean): Promise<{
        user: {
            firstName: string;
            lastName: string;
        };
    } & {
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        reviewedAt: Date | null;
        justification: string | null;
        justified: boolean;
        documentPath: string | null;
        reviewedBy: string | null;
    }>;
}
