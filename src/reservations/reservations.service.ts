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

  async getMyReservations(user: User): Promise<any[]> {
    const reservations = await this.reservationRepository.find({
      where: {
        user: { id: user.id },
      },
      relations: ['showtime', 'showtime.movie', 'payment'],
      order: {
        payment: {
          date: 'DESC',
        },
      },
    });

    if (!reservations.length) return [];

    const response = reservations.map((reservation) => ({
      id: reservation.id,
      movieTitle: reservation.showtime.movie.title,
      poster: reservation.showtime.movie.posterUrl,
      date: reservation.payment.date,
      time: reservation.showtime.time,
      seats: reservation.seats,
      total: reservation.payment.total / 100,
      cinema: 'CineReserve IMAX',
      transactionId: reservation.payment.id.split('-')[0],
      status: 'completed',
    }));

    return response;
  }

  async getReservationById(reservationID: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationID },
      relations: ['showtime', 'showtime.movie', 'payment'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return {
      id: reservation.id,
      movieTitle: reservation.showtime.movie.title,
      poster: reservation.showtime.movie.posterUrl,
      date: reservation.payment.date,
      time: reservation.showtime.time,
      seats: reservation.seats,
      total: reservation.payment.total / 100,
      cinema: 'CineReserve IMAX',
      transactionId: reservation.payment.id.split('-')[0],
      status: 'completed',
      ticketPrice: 15,
      format: 'IMAX',
      paymentMethod: reservation.payment.type,
    };
  }
}
