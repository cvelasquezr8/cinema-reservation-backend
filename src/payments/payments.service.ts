import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentAndReservationDto } from './dto/create-payment-reservation.dto';
import { Payment } from './entities/payment.entity';
import { Reservation } from '@reservations/entities/reservation.entity';
import { User } from '@auth/entities/user.entity';
import { Showtime } from '@showtimes/entities/showtime.entity';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-08-16' as any,
    });
  }

  async createPaymentIntent(
    paymentDto: CreatePaymentAndReservationDto,
    userId: string,
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: paymentDto.total,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      });

      const showtime = await this.showtimeRepository.findOneByOrFail({
        id: paymentDto.showtimeId,
      });

      const payment = this.paymentRepository.create({
        transactionId: paymentIntent.id,
        type: paymentDto.type,
        total: paymentDto.total,
        date: paymentDto.date,
      });

      const savedPayment = await this.paymentRepository.save(payment);
      const reservation = this.reservationRepository.create({
        user: { id: userId },
        showtime,
        seats: paymentDto.seats,
        payment: savedPayment,
      });

      await this.reservationRepository.save(reservation);

      return {
        transactionID: savedPayment.id,
        type: paymentDto.type,
        date: paymentDto.date,
      };
    } catch (error) {
      console.error('Error creating payment and reservation:', error);
      throw new InternalServerErrorException(
        `Error creating payment and reservation: ${error.message}`,
      );
    }
  }
}
