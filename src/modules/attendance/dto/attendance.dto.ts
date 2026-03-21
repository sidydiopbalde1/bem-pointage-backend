import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { AttendanceType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CheckInDto {
  @ApiProperty({ enum: ['QR_CODE', 'MANUAL'] })
  @IsEnum(['QR_CODE', 'MANUAL'])
  type: AttendanceType;

  @ApiProperty({ example: 14.6928, description: "Latitude GPS de l'employé" })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ example: -17.4467, description: "Longitude GPS de l'employé" })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  longitude: number;

  @ApiPropertyOptional({ example: 'Arrivée depuis le site client' })
  @IsString()
  @IsOptional()
  note?: string;
}

export class ManualAttendanceDto {
  @ApiProperty({ example: 'clxxxxx' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '2026-03-20' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '2026-03-20T08:00:00.000Z' })
  @IsDateString()
  checkIn: string;

  @ApiPropertyOptional({ example: '2026-03-20T17:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @ApiPropertyOptional({ example: 'Pointage manuel' })
  @IsString()
  @IsOptional()
  note?: string;
}

export class AttendanceFilterDto {
  @ApiPropertyOptional({ example: '2026-03-01' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-03-31' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ example: 'clxxxxx' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ example: 'Informatique' })
  @IsString()
  @IsOptional()
  department?: string;
}
