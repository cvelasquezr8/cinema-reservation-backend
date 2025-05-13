import {
  IsUUID,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  showtimeId: string;

  @IsArray()
  @ArrayNotEmpty()
  seats: string[];

  @IsNumber()
  @IsPositive()
  total: number;
}
