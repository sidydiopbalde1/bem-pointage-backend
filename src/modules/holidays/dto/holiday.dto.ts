import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateHolidayDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateHolidayDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
