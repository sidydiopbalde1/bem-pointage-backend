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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const qr_code_service_1 = require("../qr-code/qr-code.service");
const dashboard_gateway_1 = require("../dashboard/dashboard.gateway");
const mail_service_1 = require("../mail/mail.service");
const geolocation_service_1 = require("./geolocation.service");
let AttendanceService = class AttendanceService {
    prisma;
    qrCodeService;
    dashboardGateway;
    mailService;
    geolocationService;
    constructor(prisma, qrCodeService, dashboardGateway, mailService, geolocationService) {
        this.prisma = prisma;
        this.qrCodeService = qrCodeService;
        this.dashboardGateway = dashboardGateway;
        this.mailService = mailService;
        this.geolocationService = geolocationService;
    }
    computeStatus(checkInTime, workStartTime) {
        const [hours, minutes] = workStartTime.split(':').map(Number);
        const threshold = new Date(checkInTime);
        threshold.setHours(hours, minutes, 0, 0);
        return checkInTime > threshold ? client_1.AttendanceStatus.LATE : client_1.AttendanceStatus.PRESENT;
    }
    todayDate() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }
    async checkIn(userId, dto) {
        this.geolocationService.assertWithinOffice(dto.latitude, dto.longitude);
        return this.doCheckIn(userId, dto.type, dto.note);
    }
    async doCheckIn(userId, type, note) {
        const date = this.todayDate();
        const now = new Date();
        const existing = await this.prisma.attendance.findUnique({
            where: { userId_date: { userId, date } },
        });
        if (existing)
            throw new common_1.BadRequestException("Pointage déjà effectué aujourd'hui");
        const attendance = await this.prisma.attendance.create({
            data: {
                userId,
                date,
                checkIn: now,
                type,
                status: client_1.AttendanceStatus.PRESENT,
                note,
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        department: true,
                        workStartTime: true,
                    },
                },
            },
        });
        const status = this.computeStatus(now, attendance.user.workStartTime);
        if (status === client_1.AttendanceStatus.LATE) {
            await this.prisma.attendance.update({
                where: { id: attendance.id },
                data: { status: client_1.AttendanceStatus.LATE },
            });
            attendance.status = client_1.AttendanceStatus.LATE;
        }
        this.dashboardGateway.emitAttendanceUpdate(attendance);
        if (status === client_1.AttendanceStatus.LATE) {
            const [hours, minutes] = attendance.user.workStartTime.split(':').map(Number);
            const lateThreshold = new Date(now);
            lateThreshold.setHours(hours, minutes, 0, 0);
            const minutesLate = Math.round((now.getTime() - lateThreshold.getTime()) / 60000);
            this.mailService
                .sendLateNotification({
                to: attendance.user.email,
                firstName: attendance.user.firstName,
                checkInTime: now,
                minutesLate,
            })
                .catch(() => null);
        }
        return attendance;
    }
    async checkOut(userId) {
        const date = this.todayDate();
        const attendance = await this.prisma.attendance.findUnique({
            where: { userId_date: { userId, date } },
        });
        if (!attendance)
            throw new common_1.NotFoundException("Aucun pointage d'entrée trouvé pour aujourd'hui");
        if (attendance.checkOut)
            throw new common_1.BadRequestException('Sortie déjà enregistrée');
        const updated = await this.prisma.attendance.update({
            where: { id: attendance.id },
            data: { checkOut: new Date() },
            include: { user: { select: { firstName: true, lastName: true } } },
        });
        this.dashboardGateway.emitAttendanceUpdate(updated);
        return updated;
    }
    async scanQrCode(token) {
        const qrCode = await this.qrCodeService.findByToken(token);
        const date = this.todayDate();
        const existing = await this.prisma.attendance.findUnique({
            where: { userId_date: { userId: qrCode.userId, date } },
        });
        if (existing && !existing.checkOut)
            return this.checkOut(qrCode.userId);
        return this.doCheckIn(qrCode.userId, client_1.AttendanceType.QR_CODE);
    }
    async createManual(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
            select: { id: true, workStartTime: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Employé introuvable');
        const date = new Date(dto.date);
        date.setHours(0, 0, 0, 0);
        return this.prisma.attendance.upsert({
            where: { userId_date: { userId: dto.userId, date } },
            update: {
                checkIn: new Date(dto.checkIn),
                checkOut: dto.checkOut ? new Date(dto.checkOut) : null,
                type: client_1.AttendanceType.MANUAL,
                note: dto.note,
            },
            create: {
                userId: dto.userId,
                date,
                checkIn: new Date(dto.checkIn),
                checkOut: dto.checkOut ? new Date(dto.checkOut) : null,
                type: client_1.AttendanceType.MANUAL,
                status: this.computeStatus(new Date(dto.checkIn), user.workStartTime),
                note: dto.note,
            },
            include: { user: { select: { firstName: true, lastName: true } } },
        });
    }
    findMine(userId) {
        return this.prisma.attendance.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
    }
    findAll(filter) {
        const { startDate, endDate, userId, department } = filter;
        return this.prisma.attendance.findMany({
            where: {
                ...(userId && { userId }),
                ...(startDate &&
                    endDate && {
                    date: { gte: new Date(startDate), lte: new Date(endDate) },
                }),
                ...(department && { user: { department } }),
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        department: true,
                        position: true,
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    async getTodayStats() {
        const date = this.todayDate();
        const [total, present, late] = await Promise.all([
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.attendance.count({
                where: { date, status: client_1.AttendanceStatus.PRESENT },
            }),
            this.prisma.attendance.count({
                where: { date, status: client_1.AttendanceStatus.LATE },
            }),
        ]);
        return {
            total,
            present: present + late,
            late,
            absent: total - (present + late),
            date,
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        qr_code_service_1.QrCodeService,
        dashboard_gateway_1.DashboardGateway,
        mail_service_1.MailService,
        geolocation_service_1.GeolocationService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map