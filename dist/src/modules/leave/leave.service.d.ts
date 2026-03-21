import { LeaveStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeaveDto, ReviewLeaveDto } from './dto/leave.dto';
export declare class LeaveService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateLeaveDto): Promise<{
        user: {
            firstName: string;
            lastName: string;
            department: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.LeaveType;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.LeaveType;
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
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.LeaveType;
        userId: string;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.LeaveStatus;
        reason: string;
        reviewerId: string | null;
        reviewedAt: Date | null;
    }>;
    cancel(leaveId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.LeaveType;
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
