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
exports.AbsencesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AbsencesService = class AbsencesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async justify(userId, dto, documentPath) {
        const date = new Date(dto.date);
        const attendance = await this.prisma.attendance.findUnique({
            where: { userId_date: { userId, date } },
        });
        if (attendance) {
            throw new common_1.BadRequestException('Un pointage existe déjà pour cette date, ce n\'est pas une absence');
        }
        return this.prisma.absence.upsert({
            where: { userId_date: { userId, date } },
            create: {
                userId,
                date,
                justification: dto.justification,
                documentPath: documentPath ?? null,
            },
            update: {
                justification: dto.justification,
                ...(documentPath && { documentPath }),
            },
        });
    }
    findMine(userId) {
        return this.prisma.absence.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
    }
    findAll(userId, justified) {
        return this.prisma.absence.findMany({
            where: {
                ...(userId && { userId }),
                ...(justified !== undefined && { justified }),
            },
            include: {
                user: { select: { firstName: true, lastName: true, department: true } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async review(id, reviewerId, justified) {
        const absence = await this.prisma.absence.findUnique({ where: { id } });
        if (!absence)
            throw new common_1.NotFoundException('Absence introuvable');
        return this.prisma.absence.update({
            where: { id },
            data: { justified, reviewedBy: reviewerId, reviewedAt: new Date() },
            include: {
                user: { select: { firstName: true, lastName: true } },
            },
        });
    }
};
exports.AbsencesService = AbsencesService;
exports.AbsencesService = AbsencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AbsencesService);
//# sourceMappingURL=absences.service.js.map