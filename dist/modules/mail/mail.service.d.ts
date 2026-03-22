import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly config;
    private readonly transporter;
    private readonly logger;
    private readonly from;
    constructor(config: ConfigService);
    sendWelcome(opts: {
        to: string;
        firstName: string;
        lastName: string;
        resetToken: string;
    }): Promise<void>;
    sendLateNotification(opts: {
        to: string;
        firstName: string;
        checkInTime: Date;
        minutesLate: number;
    }): Promise<void>;
    sendMonthlyReport(opts: {
        to: string;
        firstName: string;
        month: number;
        year: number;
        stats: {
            workingDays: number;
            present: number;
            late: number;
            absent: number;
            totalHours: number;
        };
        attendances: Array<{
            date: Date;
            checkIn: Date;
            checkOut: Date | null;
            status: string;
        }>;
    }): Promise<void>;
    sendLeaveRequestToAdmin(opts: {
        adminEmail: string;
        employeeFirstName: string;
        employeeLastName: string;
        department: string | null;
        type: string;
        startDate: Date;
        endDate: Date;
        reason: string;
    }): Promise<void>;
    sendLeaveReviewToEmployee(opts: {
        to: string;
        firstName: string;
        type: string;
        startDate: Date;
        endDate: Date;
        status: 'APPROVED' | 'REJECTED';
    }): Promise<void>;
    private statCard;
    private send;
}
