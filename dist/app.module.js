"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./prisma/prisma.module");
const mail_module_1 = require("./modules/mail/mail.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const qr_code_module_1 = require("./modules/qr-code/qr-code.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const leave_module_1 = require("./modules/leave/leave.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const reports_module_1 = require("./modules/reports/reports.module");
const health_controller_1 = require("./health/health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            qr_code_module_1.QrCodeModule,
            attendance_module_1.AttendanceModule,
            leave_module_1.LeaveModule,
            dashboard_module_1.DashboardModule,
            reports_module_1.ReportsModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map