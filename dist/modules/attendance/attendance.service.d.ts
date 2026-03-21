import { PrismaService } from '../../prisma/prisma.service';
import { QrCodeService } from '../qr-code/qr-code.service';
import { DashboardGateway } from '../dashboard/dashboard.gateway';
import { MailService } from '../mail/mail.service';
import { GeolocationService } from './geolocation.service';
import { CheckInDto, ManualAttendanceDto, AttendanceFilterDto } from './dto/attendance.dto';
export declare class AttendanceService {
    private readonly prisma;
    private readonly qrCodeService;
    private readonly dashboardGateway;
    private readonly mailService;
    private readonly geolocationService;
    constructor(prisma: PrismaService, qrCodeService: QrCodeService, dashboardGateway: DashboardGateway, mailService: MailService, geolocationService: GeolocationService);
    private computeStatus;
    private todayDate;
    checkIn(userId: string, dto: CheckInDto): Promise<{
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
    private doCheckIn;
    checkOut(userId: string): Promise<{
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
    findMine(userId: string): import("@prisma/client").Prisma.PrismaPromise<{
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
