import { PrismaService } from '../../prisma/prisma.service';
interface ReportFilter {
    startDate: string;
    endDate: string;
    department?: string;
}
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generateAttendanceExcel(filter: ReportFilter): Promise<Buffer>;
    getMonthlyStats(year: number, month: number): Promise<{
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
export {};
