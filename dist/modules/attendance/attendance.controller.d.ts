import { AttendanceService } from './attendance.service';
import { CheckInDto, ManualAttendanceDto, AttendanceFilterDto } from './dto/attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkIn(user: {
        id: string;
    }, dto: CheckInDto): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            department: string | null;
            workStartTime: string;
        };
    } & {
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.AttendanceType;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        note: string | null;
    }>;
    checkOut(user: {
        id: string;
    }): Promise<{
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
        type: import("@prisma/client").$Enums.AttendanceType;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        note: string | null;
    }>;
    scanQrCode(token: string): Promise<{
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
        type: import("@prisma/client").$Enums.AttendanceType;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        note: string | null;
    }>;
    createManual(dto: ManualAttendanceDto): Promise<{
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
        type: import("@prisma/client").$Enums.AttendanceType;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        note: string | null;
    }>;
    findMine(user: {
        id: string;
    }): import("@prisma/client").Prisma.PrismaPromise<{
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.AttendanceType;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        note: string | null;
    }[]>;
    findAll(filter: AttendanceFilterDto): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            firstName: string;
            lastName: string;
            department: string | null;
            position: string | null;
        };
    } & {
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.AttendanceType;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        note: string | null;
    })[]>;
    getTodayStats(): Promise<{
        total: number;
        present: number;
        late: number;
        absent: number;
        date: Date;
    }>;
}
