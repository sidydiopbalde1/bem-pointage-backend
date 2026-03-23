import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { AbsencesService } from './absences.service';
import { CloudinaryService } from './cloudinary.service';
import { JustifyAbsenceDto } from './dto/absence.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
  if (allowed.includes(extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF, JPG et PNG sont acceptés'), false);
  }
};

@UseGuards(JwtAuthGuard)
@Controller('absences')
export class AbsencesController {
  constructor(
    private readonly service: AbsencesService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  /** Employé soumet une justification (avec ou sans fichier) */
  @Post('justify')
  @UseInterceptors(
    FileInterceptor('document', {
      storage: memoryStorage(),
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
    }),
  )
  async justify(
    @CurrentUser() user: { id: string },
    @Body() dto: JustifyAbsenceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let documentUrl: string | undefined;

    if (file) {
      const result = await this.cloudinary.uploadBuffer(
        file.buffer,
        file.originalname,
      );
      documentUrl = result.secure_url;
    }

    return this.service.justify(user.id, dto, documentUrl);
  }

  /** Employé consulte ses absences */
  @Get('my')
  findMine(@CurrentUser() user: { id: string }) {
    return this.service.findMine(user.id);
  }

  /** Admin/Manager liste toutes les absences */
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  findAll(
    @Query('userId') userId?: string,
    @Query('justified') justified?: string,
  ) {
    const justifiedBool =
      justified === 'true' ? true : justified === 'false' ? false : undefined;
    return this.service.findAll(userId, justifiedBool);
  }

  /** Admin/Manager valide ou refuse une justification */
  @Patch(':id/review')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  review(
    @Param('id') id: string,
    @CurrentUser() reviewer: { id: string },
    @Body('justified') justified: boolean,
  ) {
    return this.service.review(id, reviewer.id, justified);
  }
}
