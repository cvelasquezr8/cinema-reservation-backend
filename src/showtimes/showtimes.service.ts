import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

// Custom imports
import { Showtime } from '@showtimes/entities/showtime.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
  ) {}

  async findOne(id: string) {
    const showtime = await this.showtimeRepository.findOne({
      where: { id },
      relations: ['room', 'movie'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with id ${id} not found`);
    }

    return showtime;
  }
}
