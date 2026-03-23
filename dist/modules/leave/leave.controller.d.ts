import type { LeaveStatus } from '@prisma/client';
import { LeaveService } from './leave.service';
import { CreateLeaveDto, ReviewLeaveDto } from './dto/leave.dto';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    create(user: {
        id: string;
    }, dto: CreateLeaveDto): Promise<{
        workingDays: number;
        user: {
            firstName: string;
            lastName: string;
            department: string | null;
        };
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
    findMine(user: {
        id: string;
    }): import("@prisma/client").Prisma.PrismaPromise<({
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
    myStats(user: {
        id: string;
    }): import("@prisma/client").Prisma.GetLeaveGroupByPayload<{
        by: ("type" | "status")[];
        where: {
            userId: string;
            status: "APPROVED";
        };
        _count: true;
    }>;
    findAll(status?: LeaveStatus): import("@prisma/client").Prisma.PrismaPromise<({
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
    review(id: string, user: {
        id: string;
    }, dto: ReviewLeaveDto): Promise<{
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
    cancel(id: string, user: {
        id: string;
    }): Promise<{
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
}
