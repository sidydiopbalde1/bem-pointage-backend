import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class JustifyAbsenceDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  justification: string;
}
