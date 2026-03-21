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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
function parseDuration(duration) {
    const match = duration.match(/^(\d+)(s|m|h|d)$/);
    if (!match)
        return 24 * 60 * 60 * 1000;
    const value = parseInt(match[1]);
    const unit = match[2];
    const multipliers = {
        s: 1000,
        m: 60000,
        h: 3600000,
        d: 86400000,
    };
    return value * multipliers[unit];
}
let AuthService = class AuthService {
    prisma;
    jwtService;
    config;
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Compte inactif. Veuillez activer votre compte via le lien reçu par email.');
        }
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const jti = (0, crypto_1.randomUUID)();
        const payload = { sub: user.id, email: user.email, role: user.role, jti };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                department: user.department,
            },
        };
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { passwordResetToken: dto.token },
        });
        if (!user)
            throw new common_1.BadRequestException('Token invalide ou expiré');
        if (user.passwordResetExpiry && user.passwordResetExpiry < new Date()) {
            throw new common_1.BadRequestException('Token expiré. Contactez un administrateur.');
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                isActive: true,
                passwordResetToken: null,
                passwordResetExpiry: null,
            },
        });
        return {
            message: 'Mot de passe défini avec succès. Vous pouvez maintenant vous connecter.',
        };
    }
    async logout(jti) {
        const expiresIn = this.config.get('JWT_EXPIRES_IN') ?? '1d';
        const ms = parseDuration(expiresIn);
        const expiresAt = new Date(Date.now() + ms);
        await this.prisma.tokenBlacklist.create({ data: { jti, expiresAt } });
        return { message: 'Déconnexion réussie' };
    }
    async getProfile(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                department: true,
                position: true,
                phone: true,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map