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
exports.UpdateUserDto = exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
    firstName;
    lastName;
    email;
    password;
    role;
    department;
    position;
    phone;
    workStartTime;
    workEndTime;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sidy' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Diop' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sidy@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'secret123', minLength: 6 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
        default: 'EMPLOYEE',
    }),
    (0, class_validator_1.IsEnum)(['ADMIN', 'MANAGER', 'EMPLOYEE']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Informatique' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Développeur' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+221 77 000 00 00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '08:00', description: "Heure d'arrivée (HH:MM)" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
        message: "workStartTime doit être au format HH:MM (ex: 08:00)",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "workStartTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '17:00', description: 'Heure de départ (HH:MM)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
        message: "workEndTime doit être au format HH:MM (ex: 17:00)",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "workEndTime", void 0);
class UpdateUserDto {
    firstName;
    lastName;
    role;
    department;
    position;
    workStartTime;
    workEndTime;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sidy' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Diop' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'] }),
    (0, class_validator_1.IsEnum)(['ADMIN', 'MANAGER', 'EMPLOYEE']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Informatique' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Développeur' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '08:00', description: "Heure d'arrivée (HH:MM)" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
        message: "workStartTime doit être au format HH:MM (ex: 08:00)",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "workStartTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '17:00', description: 'Heure de départ (HH:MM)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
        message: "workEndTime doit être au format HH:MM (ex: 17:00)",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "workEndTime", void 0);
//# sourceMappingURL=user.dto.js.map