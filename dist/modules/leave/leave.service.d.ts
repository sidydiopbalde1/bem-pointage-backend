import { LeaveStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateLeaveDto, ReviewLeaveDto } from './dto/leave.dto';
export declare class LeaveService {
    private readonly prisma;
    private readonly mail;
    constructor(prisma: PrismaService, mail: MailService);
    create(userId: string, dto: CreateLeaveDto): Promise<{
        user: {
            firstName: string;
            lastName: string;
            department: string | null;
        };
    } & {
        type: import("@prisma/client").$Enums.LeaveType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.LeaveStatus;
        reason: string;
        reviewerId: string | null;
        reviewedAt: Date | null;
    }>;
    findAll(userId?: string, status?: LeaveStatus): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            firstName: string;
            lastName: string;
            department: string | null;
        };
    } & {
        type: import("@prisma/client").$Enums.LeaveType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.LeaveStatus;
        reason: string;
        reviewerId: string | null;
        reviewedAt: Date | null;
    })[]>;
    review(leaveId: string, reviewerId: string, dto: ReviewLeaveDto): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        type: import("@prisma/client").$Enums.LeaveType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.LeaveStatus;
        reason: string;
        reviewerId: string | null;
        reviewedAt: Date | null;
    }>;
    cancel(leaveId: string, userId: string): Promise<{
        type: import("@prisma/client").$Enums.LeaveType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.LeaveStatus;
        reason: string;
        reviewerId: string | null;
        reviewedAt: Date | null;
    }>;
    getStats(userId: string): import("@prisma/client").Prisma.GetLeaveGroupByPayload<{
        by: ("type" | "status")[];
        where: {
            userId: string;
            status: "APPROVED";
        };
        _count: true;
    }>;
}
