import { QrCodeService } from './qr-code.service';
export declare class QrCodeController {
    private readonly qrCodeService;
    constructor(qrCodeService: QrCodeService);
    getMyQrCode(user: {
        id: string;
    }): Promise<{
        dataUrl: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        token: string;
        userId: string;
    }>;
    regenerateMine(user: {
        id: string;
    }): Promise<{
        dataUrl: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        token: string;
        userId: string;
    }>;
    getForUser(userId: string): Promise<{
        dataUrl: string;
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
