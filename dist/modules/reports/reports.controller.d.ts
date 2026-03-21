import type { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    exportAttendance(startDate: string, endDate: string, department: string | undefined, res: Response): Promise<void>;
    getMonthlyStats(year: string, month: string): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            department: string | null;
        };
        present: number;
        late: number;
        totalDays: number;
    }[]>;
}
