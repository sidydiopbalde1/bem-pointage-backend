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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const qr_code_service_1 = require("./qr-code.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let QrCodeController = class QrCodeController {
    qrCodeService;
    constructor(qrCodeService) {
        this.qrCodeService = qrCodeService;
    }
    getMyQrCode(user) {
        return this.qrCodeService.generateForUser(user.id);
    }
    regenerateMine(user) {
        return this.qrCodeService.regenerate(user.id);
    }
    getForUser(userId) {
        return this.qrCodeService.generateForUser(userId);
    }
    regenerate(userId) {
        return this.qrCodeService.regenerate(userId);
    }
};
exports.QrCodeController = QrCodeController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Mon QR code de pointage' }),
    (0, common_1.Get)('my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QrCodeController.prototype, "getMyQrCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Regénérer mon propre QR code' }),
    (0, common_1.Patch)('my/regenerate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QrCodeController.prototype, "regenerateMine", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "QR code d'un utilisateur (ADMIN)" }),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QrCodeController.prototype, "getForUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Regénérer le QR code d'un utilisateur (ADMIN)" }),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Patch)(':userId/regenerate'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QrCodeController.prototype, "regenerate", null);
exports.QrCodeController = QrCodeController = __decorate([
    (0, swagger_1.ApiTags)('QR Code'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('qr-code'),
    __metadata("design:paramtypes", [qr_code_service_1.QrCodeService])
], QrCodeController);
//# sourceMappingURL=qr-code.controller.js.map