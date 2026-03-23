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
var AbsenceSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsenceSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const holidays_service_1 = require("../holidays/holidays.service");
let AbsenceSchedulerService = AbsenceSchedulerService_1 = class AbsenceSchedulerService {
    prisma;
    holidays;
    logger = new common_1.Logger(AbsenceSchedulerService_1.name);
    constructor(prisma, holidays) {
        this.prisma = prisma;
        this.holidays = holidays;
    }
    async markDailyAbsences() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isHoliday = (await this.holidays.getHolidayDatesInRange(today, today)).length > 0;
        if (isHoliday) {
            this.logger.log(`Absence check skipped: ${today.toDateString()} is a public holiday`);
            return;
        }
        const dayOfWeek = today.getDay();
        const users = await this.prisma.user.findMany({
            where: { isActive: true },
            select: { id: true, workDays: true },
        });
        let created = 0;
        for (const user of users) {
            const workDays = user.workDays
                .split(',')
                .map((d) => parseInt(d.trim(), 10));
            if (!workDays.includes(dayOfWeek))
                continue;
            const attendance = await this.prisma.attendance.findUnique({
                where: { userId_date: { userId: user.id, date: today } },
            });
            if (attendance)
                continue;
            await this.prisma.absence.upsert({
                where: { userId_date: { userId: user.id, date: today } },
                create: { userId: user.id, date: today },
                update: {},
            });
            created++;
        }
        this.logger.log(`Daily absence check: ${created} absence(s) created for ${today.toDateString()}`);
    }
};
exports.AbsenceSchedulerService = AbsenceSchedulerService;
__decorate([
    (0, schedule_1.Cron)('55 23 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AbsenceSchedulerService.prototype, "markDailyAbsences", null);
exports.AbsenceSchedulerService = AbsenceSchedulerService = AbsenceSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        holidays_service_1.HolidaysService])
], AbsenceSchedulerService);
//# sourceMappingURL=absence-scheduler.service.js.map