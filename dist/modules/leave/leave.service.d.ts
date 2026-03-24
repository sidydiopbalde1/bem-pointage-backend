import { LeaveStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { HolidaysService } from '../holidays/holidays.service';
import { CreateLeaveDto, ReviewLeaveDto } from './dto/leave.dto';
export declare class LeaveService {
    private readonly prisma;
    private readonly mail;
    private readonly holidays;
    constructor(prisma: PrismaService, mail: MailService, holidays: HolidaysService);
    private countWorkingDays;
    create(userId: string, dto: CreateLeaveDto): Promise<{
        workingDays: number;
        user: {
            firstName: string;
            lastName: string;
            department: string | null;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.LeaveType;
        status: import("@prisma/client").$Enums.LeaveStatus;
        startDate: Date;
        endDate: Date;
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
        userId: string;
        type: import("@prisma/client").$Enums.LeaveType;
        status: import("@prisma/client").$Enums.LeaveStatus;
        startDate: Date;
        endDate: Date;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.LeaveType;
        status: import("@prisma/client").$Enums.LeaveStatus;
        startDate: Date;
        endDate: Date;
        reason: string;
        reviewerId: string | null;
        reviewedAt: Date | null;
    }>;
    cancel(leaveId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.LeaveType;
        status: import("@prisma/client").$Enums.LeaveStatus;
        startDate: Date;
        endDate: Date;
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
