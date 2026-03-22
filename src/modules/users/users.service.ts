import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

const USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  department: true,
  position: true,
  phone: true,
  isActive: true,
  workStartTime: true,
  workEndTime: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email déjà utilisé');

    // Mot de passe temporaire — remplacé lors de l'activation via email
    const tempPassword = await bcrypt.hash(randomBytes(16).toString('hex'), 10);
    const resetToken = randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: tempPassword,
        isActive: false,
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
      select: USER_SELECT,
    });

    await this.prisma.qrCode.create({ data: { userId: user.id } });

    // Envoi de l'email de bienvenue (non bloquant)
    this.mailService
      .sendWelcome({
        to: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        resetToken,
      })
      .catch(() => null);

    return user;
  }

  findAll(department?: string, includeInactive = false) {
    return this.prisma.user.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(department && { department }),
      },
      select: USER_SELECT,
      orderBy: { lastName: 'asc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { ...USER_SELECT, qrCode: { select: { token: true } } },
    });
    if (!user) throw new NotFoundException('Employé introuvable');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: USER_SELECT,
    });
  }

  async deactivate(id: string) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: USER_SELECT,
    });
  }
}
