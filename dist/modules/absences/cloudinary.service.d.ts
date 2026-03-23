import { ConfigService } from '@nestjs/config';
import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    private readonly config;
    constructor(config: ConfigService);
    uploadBuffer(buffer: Buffer, originalname: string): Promise<UploadApiResponse>;
    deleteByUrl(secureUrl: string): Promise<void>;
}
