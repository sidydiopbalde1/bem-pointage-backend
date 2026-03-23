import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadBuffer(
    buffer: Buffer,
    originalname: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'justificatifs',
          resource_type: 'auto',
          public_id: `${Date.now()}-${originalname.replace(/\.[^.]+$/, '')}`,
        },
        (error, result) => {
          if (error || !result) {
            reject(new InternalServerErrorException('Erreur upload Cloudinary'));
          } else {
            resolve(result);
          }
        },
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(upload);
    });
  }

  async deleteByUrl(secureUrl: string) {
    // Extraire le public_id depuis l'URL
    const match = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (!match) return;
    await cloudinary.uploader.destroy(match[1], { resource_type: 'auto' });
  }
}
