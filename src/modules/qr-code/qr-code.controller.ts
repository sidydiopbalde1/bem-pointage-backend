import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { QrCodeService } from './qr-code.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('QR Code')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @ApiOperation({ summary: 'Mon QR code de pointage' })
  @Get('my')
  getMyQrCode(@CurrentUser() user: { id: string }) {
    return this.qrCodeService.generateForUser(user.id);
  }

  @ApiOperation({ summary: 'Regénérer mon propre QR code' })
  @Patch('my/regenerate')
  regenerateMine(@CurrentUser() user: { id: string }) {
    return this.qrCodeService.regenerate(user.id);
  }

  @ApiOperation({ summary: 'QR code d\'un utilisateur (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':userId')
  getForUser(@Param('userId') userId: string) {
    return this.qrCodeService.generateForUser(userId);
  }

  @ApiOperation({ summary: 'Regénérer le QR code d\'un utilisateur (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':userId/regenerate')
  regenerate(@Param('userId') userId: string) {
    return this.qrCodeService.regenerate(userId);
  }
}
