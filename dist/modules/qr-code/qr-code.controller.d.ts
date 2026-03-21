import { QrCodeService } from './qr-code.service';
export declare class QrCodeController {
    private readonly qrCodeService;
    constructor(qrCodeService: QrCodeService);
    getMyQrCode(user: {
        id: string;
    }): Promise<{
        dataUrl: string;
        token: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    regenerateMine(user: {
        id: string;
    }): Promise<{
        dataUrl: string;
        token: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getForUser(userId: string): Promise<{
        dataUrl: string;
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
