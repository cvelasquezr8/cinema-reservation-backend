import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { RoomsModule } from '@rooms/rooms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seat]), RoomsModule],
  controllers: [SeatsController],
  providers: [SeatsService],
  exports: [TypeOrmModule],
})
export class SeatsModule {}
