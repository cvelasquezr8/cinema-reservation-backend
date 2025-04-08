import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './entities/showtime.entity';
import { RoomsModule } from '@rooms/rooms.module';
import { MoviesModule } from '@movies/movies.module';
import { ReservationsModule } from '@reservations/reservations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Showtime]),
    RoomsModule,
    MoviesModule,
    forwardRef(() => ReservationsModule),
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [TypeOrmModule],
})
export class ShowtimesModule {}
