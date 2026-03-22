import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import type { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'Sidy' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Diop' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'sidy@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    default: 'EMPLOYEE',
  })
  @IsEnum(['ADMIN', 'MANAGER', 'EMPLOYEE'])
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ example: 'Informatique' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'Développeur' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ example: '+221 77 000 00 00' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '08:00', description: "Heure d'arrivée (HH:MM)" })
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: "workStartTime doit être au format HH:MM (ex: 08:00)",
  })
  @IsOptional()
  workStartTime?: string;

  @ApiPropertyOptional({ example: '17:00', description: 'Heure de départ (HH:MM)' })
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: "workEndTime doit être au format HH:MM (ex: 17:00)",
  })
  @IsOptional()
  workEndTime?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Sidy' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Diop' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'] })
  @IsEnum(['ADMIN', 'MANAGER', 'EMPLOYEE'])
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ example: 'Informatique' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'Développeur' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ example: '08:00', description: "Heure d'arrivée (HH:MM)" })
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: "workStartTime doit être au format HH:MM (ex: 08:00)",
  })
  @IsOptional()
  workStartTime?: string;

  @ApiPropertyOptional({ example: '17:00', description: 'Heure de départ (HH:MM)' })
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: "workEndTime doit être au format HH:MM (ex: 17:00)",
  })
  @IsOptional()
  workEndTime?: string;
}
