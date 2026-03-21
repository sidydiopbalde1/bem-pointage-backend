import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class QrCodeService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    generateForUser(userId: string): Promise<{
        dataUrl: string;
        token: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
        token: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    regenerate(userId: string): Promise<{
        dataUrl: string;
        token: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
