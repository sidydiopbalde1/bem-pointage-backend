import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { CreateHolidayDto, UpdateHolidayDto } from './dto/holiday.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('holidays')
export class HolidaysController {
  constructor(private readonly service: HolidaysService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateHolidayDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('year') year?: string) {
    return this.service.findAll(year ? parseInt(year, 10) : undefined);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateHolidayDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
