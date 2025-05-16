import {
  Controller,
  Post,
  Body,
  ParseUUIDPipe,
  Param,
  Get,
} from '@nestjs/common';

// Custom imports
import { Auth, GetUser } from '@auth/decorators';
import { User } from '@auth/entities/user.entity';
import { ReservationsService } from '@reservations/reservations.service';
import { CreateReservationDto } from '@reservations/dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Auth()
  create(@Body() dto: CreateReservationDto, @GetUser() user: User) {
    return this.reservationsService.createReservation(dto, user);
  }

  @Get('/showtimes/:id/seats')
  getReservedSeats(@Param('id', ParseUUIDPipe) showtimeId: string) {
    return this.reservationsService.findByShowtime(showtimeId);
  }

  @Get('my')
  @Auth()
  getMyReservations(@GetUser() user: User) {
    return this.reservationsService.getMyReservations(user);
  }

  @Get(':id')
  @Auth()
  getReservationById(@Param('id', ParseUUIDPipe) reservationId: string) {
    return this.reservationsService.getReservationById(reservationId);
  }
}
