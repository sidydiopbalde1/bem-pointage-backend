"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const ExcelJS = __importStar(require("exceljs"));
const prisma_service_1 = require("../../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateAttendanceExcel(filter) {
        const attendances = await this.prisma.attendance.findMany({
            where: {
                date: { gte: new Date(filter.startDate), lte: new Date(filter.endDate) },
                ...(filter.department && { user: { department: filter.department } }),
            },
            include: {
                user: { select: { firstName: true, lastName: true, department: true, position: true } },
            },
            orderBy: [{ date: 'asc' }, { user: { lastName: 'asc' } }],
        });
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Pointages');
        sheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Nom', key: 'lastName', width: 18 },
            { header: 'Prénom', key: 'firstName', width: 18 },
            { header: 'Département', key: 'department', width: 18 },
            { header: 'Poste', key: 'position', width: 20 },
            { header: 'Arrivée', key: 'checkIn', width: 12 },
            { header: 'Départ', key: 'checkOut', width: 12 },
            { header: 'Statut', key: 'status', width: 12 },
            { header: 'Type', key: 'type', width: 12 },
        ];
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2563EB' },
        };
        const formatTime = (date) => date
            ? new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            : '-';
        attendances.forEach((a) => {
            sheet.addRow({
                date: new Date(a.date).toLocaleDateString('fr-FR'),
                lastName: a.user.lastName,
                firstName: a.user.firstName,
                department: a.user.department ?? '-',
                position: a.user.position ?? '-',
                checkIn: formatTime(a.checkIn),
                checkOut: formatTime(a.checkOut),
                status: a.status,
                type: a.type,
            });
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async getMonthlyStats(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const [attendances, users] = await Promise.all([
            this.prisma.attendance.groupBy({
                by: ['userId', 'status'],
                where: { date: { gte: startDate, lte: endDate } },
                _count: true,
            }),
            this.prisma.user.findMany({
                where: { isActive: true },
                select: { id: true, firstName: true, lastName: true, department: true },
            }),
        ]);
        return users.map((user) => {
            const userAttendances = attendances.filter((a) => a.userId === user.id);
            const present = userAttendances.find((a) => a.status === 'PRESENT')?._count ?? 0;
            const late = userAttendances.find((a) => a.status === 'LATE')?._count ?? 0;
            return { user, present, late, totalDays: present + late };
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map