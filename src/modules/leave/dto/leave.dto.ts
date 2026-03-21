import { ApiProperty } from '@nestjs/swagger';
import type { LeaveType } from '@prisma/client';
import { IsDateString, IsEnum, IsString } from 'class-validator';

const ReviewableLeaveStatus = { APPROVED: 'APPROVED', REJECTED: 'REJECTED' } as const;

export class CreateLeaveDto {
  @ApiProperty({ enum: ['ANNUAL', 'SICK', 'MATERNITY', 'UNPAID', 'OTHER'] })
  @IsEnum(['ANNUAL', 'SICK', 'MATERNITY', 'UNPAID', 'OTHER'])
  type: LeaveType;

  @ApiProperty({ example: '2026-04-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-04-05' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Congé annuel' })
  @IsString()
  reason: string;
}

export class ReviewLeaveDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
  @IsEnum(ReviewableLeaveStatus)
  status: 'APPROVED' | 'REJECTED';
}
