import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Custom imports
import { RoomsService } from '@rooms/rooms.service';
import { RoomsController } from '@rooms/rooms.controller';
import { Room } from '@rooms/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [TypeOrmModule],
})
export class RoomsModule {}
