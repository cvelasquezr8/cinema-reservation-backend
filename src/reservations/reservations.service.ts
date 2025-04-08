import { Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Custom imports
import { User } from '@auth/entities/user.entity';
import { Seat } from '@seats/entities/seat.entity';
import { Showtime } from '@showtimes/entities/showtime.entity';
import { Reservation } from '@reservations/entities/reservation.entity';
import { CreateReservationDto } from '@reservations/dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,
    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>,
  ) {}

  async create(dto: CreateReservationDto, user: User) {
    const showtime = await this.showtimeRepo.findOne({
      where: { id: dto.showtimeId },
    });

    if (!showtime) throw new NotFoundException('Showtime not found');

    const seat = await this.seatRepo.findOne({ where: { id: dto.seatId } });
    if (!seat) throw new NotFoundException('Seat not found');

    const existingReservation = await this.reservationRepo.findOne({
      where: {
        showtime: { id: dto.showtimeId },
        seat: { id: dto.seatId },
      },
    });

    if (existingReservation) {
      throw new BadRequestException('Seat already reserved for this showtime');
    }

    const reservation = this.reservationRepo.create({
      user,
      showtime,
      seat,
    });

    return this.reservationRepo.save(reservation);
  }

  async remove(id: string, currentUser: User) {
    const reservation = await this.reservationRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    const isOwner = reservation.user.id === currentUser.id;
    const isAdmin = currentUser.roles.some((role) =>
      ['admin', 'super-user'].includes(role),
    );

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to cancel this reservation',
      );
    }

    return this.reservationRepo.softDelete(id);
  }

  async getReservedSeatsByShowtime(showtimeId: string) {
    const reservations = await this.reservationRepo.find({
      where: { showtime: { id: showtimeId } },
      relations: ['seat'],
    });

    return reservations.map((res) => res.seat);
  }
}
