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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidaysService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let HolidaysService = class HolidaysService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.publicHoliday.findUnique({
            where: { date: new Date(dto.date) },
        });
        if (existing) {
            throw new common_1.ConflictException('Un jour férié existe déjà à cette date');
        }
        return this.prisma.publicHoliday.create({
            data: { date: new Date(dto.date), name: dto.name },
        });
    }
    findAll(year) {
        if (year) {
            return this.prisma.publicHoliday.findMany({
                where: {
                    date: {
                        gte: new Date(`${year}-01-01`),
                        lte: new Date(`${year}-12-31`),
                    },
                },
                orderBy: { date: 'asc' },
            });
        }
        return this.prisma.publicHoliday.findMany({ orderBy: { date: 'asc' } });
    }
    async update(id, dto) {
        const holiday = await this.prisma.publicHoliday.findUnique({ where: { id } });
        if (!holiday)
            throw new common_1.NotFoundException('Jour férié introuvable');
        return this.prisma.publicHoliday.update({
            where: { id },
            data: { name: dto.name },
        });
    }
    async remove(id) {
        const holiday = await this.prisma.publicHoliday.findUnique({ where: { id } });
        if (!holiday)
            throw new common_1.NotFoundException('Jour férié introuvable');
        await this.prisma.publicHoliday.delete({ where: { id } });
        return { message: 'Jour férié supprimé' };
    }
    async getHolidayDatesInRange(start, end) {
        const holidays = await this.prisma.publicHoliday.findMany({
            where: { date: { gte: start, lte: end } },
            select: { date: true },
        });
        return holidays.map((h) => h.date);
    }
};
exports.HolidaysService = HolidaysService;
exports.HolidaysService = HolidaysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HolidaysService);
//# sourceMappingURL=holidays.service.js.map