import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  reservationIds: string[];
}
