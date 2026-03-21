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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let LeaveService = class LeaveService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        if (new Date(dto.startDate) > new Date(dto.endDate)) {
            throw new common_1.BadRequestException('La date de début doit être avant la date de fin');
        }
        return this.prisma.leave.create({
            data: {
                userId,
                type: dto.type,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                reason: dto.reason,
            },
            include: {
                user: { select: { firstName: true, lastName: true, department: true } },
            },
        });
    }
    findAll(userId, status) {
        return this.prisma.leave.findMany({
            where: {
                ...(userId && { userId }),
                ...(status && { status }),
            },
            include: {
                user: { select: { firstName: true, lastName: true, department: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async review(leaveId, reviewerId, dto) {
        const leave = await this.prisma.leave.findUnique({ where: { id: leaveId } });
        if (!leave)
            throw new common_1.NotFoundException('Demande introuvable');
        if (leave.status !== client_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Cette demande a déjà été traitée');
        }
        return this.prisma.leave.update({
            where: { id: leaveId },
            data: { status: dto.status, reviewerId, reviewedAt: new Date() },
            include: { user: { select: { firstName: true, lastName: true } } },
        });
    }
    async cancel(leaveId, userId) {
        const leave = await this.prisma.leave.findFirst({ where: { id: leaveId, userId } });
        if (!leave)
            throw new common_1.NotFoundException('Demande introuvable');
        if (leave.status !== client_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Seules les demandes en attente peuvent être annulées');
        }
        return this.prisma.leave.update({
            where: { id: leaveId },
            data: { status: client_1.LeaveStatus.CANCELLED },
        });
    }
    getStats(userId) {
        return this.prisma.leave.groupBy({
            by: ['type', 'status'],
            where: { userId, status: client_1.LeaveStatus.APPROVED },
            _count: true,
        });
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaveService);
//# sourceMappingURL=leave.service.js.map