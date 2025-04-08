import {
  Controller,
  Post,
  Body,
  Req,
  HttpStatus,
  ParseUUIDPipe,
  Param,
  Delete,
  Get,
} from '@nestjs/common';

// Custom imports
import { Auth, GetUser } from '@auth/decorators';
import { User } from '@auth/entities/user.entity';
import { HttpResponse } from '@common/http-response';
import { ReservationsService } from '@reservations/reservations.service';
import { CreateReservationDto } from '@reservations/dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Auth()
  async create(
    @Body() dto: CreateReservationDto,
    @GetUser() user: User,
    @Req() req: Request,
  ) {
    try {
      const reservation = await this.reservationsService.create(dto, user);
      return HttpResponse.success(
        reservation,
        'Reservation created successfully',
        HttpStatus.CREATED,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        req.url,
      );
    }
  }

  @Delete(':id')
  @Auth()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Req() req: Request,
  ) {
    try {
      const result = await this.reservationsService.remove(id, user);
      return HttpResponse.success(
        result,
        'Reservation cancelled successfully',
        HttpStatus.OK,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        req.url,
      );
    }
  }

  @Get('/showtimes/:id/seats')
  @Auth()
  async getReservedSeats(
    @Param('id', ParseUUIDPipe) showtimeId: string,
    @Req() req: Request,
  ) {
    try {
      const seats =
        await this.reservationsService.getReservedSeatsByShowtime(showtimeId);
      return HttpResponse.success(
        seats,
        'Reserved seats retrieved successfully',
        HttpStatus.OK,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        req.url,
      );
    }
  }
}
