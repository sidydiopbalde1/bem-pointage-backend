import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            department: string | null;
        };
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(jti: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
    } | null>;
}
