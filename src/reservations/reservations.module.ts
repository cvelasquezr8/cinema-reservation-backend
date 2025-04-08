import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Custom imports
import { UsersModule } from '@users/users.module';
import { SeatsModule } from '@seats/seats.module';
import { OrdersModule } from '@orders/orders.module';
import { ShowtimesModule } from '@showtimes/showtimes.module';
import { Reservation } from '@reservations/entities/reservation.entity';
import { ReservationsService } from '@reservations/reservations.service';
import { ReservationsController } from '@reservations/reservations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    forwardRef(() => UsersModule),
    forwardRef(() => ShowtimesModule),
    SeatsModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [TypeOrmModule],
})
export class ReservationsModule {}
