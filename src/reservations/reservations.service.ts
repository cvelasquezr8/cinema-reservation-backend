import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { ShowtimesService } from '@showtimes/showtimes.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { User } from '@auth/entities/user.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly showtimesService: ShowtimesService,
  ) {}

  async createReservation(
    dto: CreateReservationDto,
    user: User,
  ): Promise<Reservation> {
    const showtime = await this.showtimesService.findById(dto.showtimeId);

    const reservation = this.reservationRepository.create({
      user,
      showtime,
      seats: dto.seats,
      total: dto.total,
    });

    return this.reservationRepository.save(reservation);
  }

  async findByShowtime(showtimeId: string): Promise<string[]> {
    const reservations = await this.reservationRepository.find({
      where: {
        showtime: { id: showtimeId },
      },
    });

    return reservations.flatMap((res) => res.seats);
  }
}
