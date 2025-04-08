import { IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  showtimeId: string;

  @IsUUID()
  seatId: string;
}
