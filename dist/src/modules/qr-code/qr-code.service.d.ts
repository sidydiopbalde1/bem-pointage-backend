import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class QrCodeService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    generateForUser(userId: string): Promise<{
        dataUrl: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        token: string;
        userId: string;
    }>;
    findByToken(token: string): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        token: string;
        userId: string;
    }>;
    regenerate(userId: string): Promise<{
        dataUrl: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        token: string;
        userId: string;
    }>;
}
