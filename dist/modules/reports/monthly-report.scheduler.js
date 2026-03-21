"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MonthlyReportScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyReportScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let MonthlyReportScheduler = MonthlyReportScheduler_1 = class MonthlyReportScheduler {
    prisma;
    mailService;
    logger = new common_1.Logger(MonthlyReportScheduler_1.name);
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async sendMonthlyReports() {
        const now = new Date();
        const reportDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const month = reportDate.getMonth() + 1;
        const year = reportDate.getFullYear();
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        this.logger.log(`Envoi des rapports mensuels pour ${month}/${year}`);
        const users = await this.prisma.user.findMany({
            where: { isActive: true },
            select: { id: true, firstName: true, email: true },
        });
        const workingDays = this.countWorkingDays(startDate, endDate);
        for (const user of users) {
            try {
                const attendances = await this.prisma.attendance.findMany({
                    where: { userId: user.id, date: { gte: startDate, lte: endDate } },
                    orderBy: { date: 'asc' },
                });
                const present = attendances.filter((a) => a.status === 'PRESENT').length;
                const late = attendances.filter((a) => a.status === 'LATE').length;
                const absent = Math.max(0, workingDays - (present + late));
                const totalHours = attendances.reduce((acc, a) => {
                    if (a.checkOut) {
                        return acc + (a.checkOut.getTime() - a.checkIn.getTime()) / 3600000;
                    }
                    return acc;
                }, 0);
                await this.mailService.sendMonthlyReport({
                    to: user.email,
                    firstName: user.firstName,
                    month,
                    year,
                    stats: { workingDays, present, late, absent, totalHours },
                    attendances: attendances.map((a) => ({
                        date: a.date,
                        checkIn: a.checkIn,
                        checkOut: a.checkOut,
                        status: a.status,
                    })),
                });
            }
            catch (error) {
                this.logger.error(`Rapport mensuel échoué pour ${user.email}: ${error.message}`);
            }
        }
        this.logger.log(`Rapports mensuels envoyés à ${users.length} utilisateurs`);
    }
    countWorkingDays(start, end) {
        let count = 0;
        const current = new Date(start);
        while (current <= end) {
            const day = current.getDay();
            if (day !== 0 && day !== 6)
                count++;
            current.setDate(current.getDate() + 1);
        }
        return count;
    }
};
exports.MonthlyReportScheduler = MonthlyReportScheduler;
__decorate([
    (0, schedule_1.Cron)('0 8 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonthlyReportScheduler.prototype, "sendMonthlyReports", null);
exports.MonthlyReportScheduler = MonthlyReportScheduler = MonthlyReportScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], MonthlyReportScheduler);
//# sourceMappingURL=monthly-report.scheduler.js.map