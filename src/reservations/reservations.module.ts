import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Custom imports
import { Reservation } from '@reservations/entities/reservation.entity';
import { ReservationsService } from '@reservations/reservations.service';
import { ReservationsController } from '@reservations/reservations.controller';
import { ShowtimesModule } from '@showtimes/showtimes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), ShowtimesModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [TypeOrmModule],
})
export class ReservationsModule {}
