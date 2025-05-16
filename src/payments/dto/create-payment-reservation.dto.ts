import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreatePaymentAndReservationDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsUUID()
  @IsNotEmpty()
  showtimeId: string;

  @IsArray()
  @IsNotEmpty()
  seats: string[];
}
