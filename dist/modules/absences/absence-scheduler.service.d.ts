import { PrismaService } from '../../prisma/prisma.service';
import { HolidaysService } from '../holidays/holidays.service';
export declare class AbsenceSchedulerService {
    private readonly prisma;
    private readonly holidays;
    private readonly logger;
    constructor(prisma: PrismaService, holidays: HolidaysService);
    markDailyAbsences(): Promise<void>;
}
