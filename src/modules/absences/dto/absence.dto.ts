import { IsDateString, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class JustifyAbsenceDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  justification: string;
}
