import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime])],
  providers: [ShowtimesService],
  exports: [TypeOrmModule, ShowtimesService],
})
export class ShowtimesModule {}
