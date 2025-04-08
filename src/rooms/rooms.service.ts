import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Custom imports
import { Room } from '@rooms/entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async getSeatsByRoomId(roomId: string) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['seats'],
    });

    if (!room) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }

    return room.seats;
  }
}
