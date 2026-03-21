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
    private statCard;
    private send;
}
