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
exports.AbsencesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const absences_service_1 = require("./absences.service");
const cloudinary_service_1 = require("./cloudinary.service");
const absence_dto_1 = require("./dto/absence.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const fileFilter = (_req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    if (allowed.includes((0, path_1.extname)(file.originalname).toLowerCase())) {
        cb(null, true);
    }
    else {
        cb(new Error('Seuls les fichiers PDF, JPG et PNG sont acceptés'), false);
    }
};
let AbsencesController = class AbsencesController {
    service;
    cloudinary;
    constructor(service, cloudinary) {
        this.service = service;
        this.cloudinary = cloudinary;
    }
    async justify(user, dto, file) {
        let documentUrl;
        if (file) {
            const result = await this.cloudinary.uploadBuffer(file.buffer, file.originalname);
            documentUrl = result.secure_url;
        }
        return this.service.justify(user.id, dto, documentUrl);
    }
    findMine(user) {
        return this.service.findMine(user.id);
    }
    findAll(userId, justified) {
        const justifiedBool = justified === 'true' ? true : justified === 'false' ? false : undefined;
        return this.service.findAll(userId, justifiedBool);
    }
    review(id, reviewer, justified) {
        return this.service.review(id, reviewer.id, justified);
    }
};
exports.AbsencesController = AbsencesController;
__decorate([
    (0, common_1.Post)('justify'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('document', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, absence_dto_1.JustifyAbsenceDto, Object]),
    __metadata("design:returntype", Promise)
], AbsencesController.prototype, "justify", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AbsencesController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('justified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AbsencesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/review'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)('justified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Boolean]),
    __metadata("design:returntype", void 0)
], AbsencesController.prototype, "review", null);
exports.AbsencesController = AbsencesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('absences'),
    __metadata("design:paramtypes", [absences_service_1.AbsencesService,
        cloudinary_service_1.CloudinaryService])
], AbsencesController);
//# sourceMappingURL=absences.controller.js.map