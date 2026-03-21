import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return 24 * 60 * 60 * 1000; // défaut: 1 jour
  const value = parseInt(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * multipliers[unit];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) throw new UnauthorizedException('Identifiants invalides');

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Compte inactif. Veuillez activer votre compte via le lien reçu par email.',
      );
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Identifiants invalides');

    const jti = randomUUID();
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

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { passwordResetToken: dto.token },
    });

    if (!user) throw new BadRequestException('Token invalide ou expiré');

    if (user.passwordResetExpiry && user.passwordResetExpiry < new Date()) {
      throw new BadRequestException('Token expiré. Contactez un administrateur.');
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

    return { message: 'Mot de passe défini avec succès. Vous pouvez maintenant vous connecter.' };
  }

  async logout(jti: string) {
    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') ?? '1d';
    const ms = parseDuration(expiresIn);
    const expiresAt = new Date(Date.now() + ms);

    await this.prisma.tokenBlacklist.create({ data: { jti, expiresAt } });
    return { message: 'Déconnexion réussie' };
  }

  async getProfile(userId: string) {
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
}
