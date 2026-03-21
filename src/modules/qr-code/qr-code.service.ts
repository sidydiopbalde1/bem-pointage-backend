import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QrCodeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async generateForUser(userId: string) {
    let qrCode = await this.prisma.qrCode.findUnique({ where: { userId } });

    if (!qrCode) {
      qrCode = await this.prisma.qrCode.create({ data: { userId } });
    }

    const scanUrl = `${this.config.get('APP_URL')}/scan/${qrCode.token}`;
    const dataUrl = await QRCode.toDataURL(scanUrl);
    return { ...qrCode, dataUrl };
  }

  async findByToken(token: string) {
    const qrCode = await this.prisma.qrCode.findUnique({
      where: { token },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, isActive: true },
        },
      },
    });

    if (!qrCode || !qrCode.user.isActive) {
      throw new NotFoundException('QR Code invalide');
    }

    return qrCode;
  }

  async regenerate(userId: string) {
    await this.prisma.qrCode.upsert({
      where: { userId },
      update: { token: crypto.randomUUID() },
      create: { userId },
    });
    return this.generateForUser(userId);
  }
}
