import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { Reservation } from '@reservations/entities/reservation.entity';
import { User } from '@auth/entities/user.entity';
import { Showtime } from '@showtimes/entities/showtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Reservation, User, Showtime])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
