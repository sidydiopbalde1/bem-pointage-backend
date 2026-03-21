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
        };
    } & {
        date: Date;
        type: import("@prisma/client").$Enums.AttendanceType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
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
        type: import("@prisma/client").$Enums.AttendanceType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
    }>;
    scanQrCode(token: string): Promise<{
        user: {
            firstName: string;
            lastName: string;
        };
    } & {
        date: Date;
        type: import("@prisma/client").$Enums.AttendanceType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
    }>;
    createManual(dto: ManualAttendanceDto): Promise<{
        user: {
            firstName: string;
            lastName: string;
        };
    } & {
        date: Date;
        type: import("@prisma/client").$Enums.AttendanceType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
    }>;
    findMine(user: {
        id: string;
    }): import("@prisma/client").Prisma.PrismaPromise<{
        date: Date;
        type: import("@prisma/client").$Enums.AttendanceType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
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
        type: import("@prisma/client").$Enums.AttendanceType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        checkIn: Date;
        checkOut: Date | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
    })[]>;
    getTodayStats(): Promise<{
        total: number;
        present: number;
        late: number;
        absent: number;
        date: Date;
    }>;
}
