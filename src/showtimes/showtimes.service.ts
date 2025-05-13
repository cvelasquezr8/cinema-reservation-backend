import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '@movies/entities/movies.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
  ) {}

  async createShowtime(
    movie: Movie,
    time: string,
    room?: string,
  ): Promise<Showtime> {
    const showtime = this.showtimeRepository.create({
      movie,
      time,
    });

    return this.showtimeRepository.save(showtime);
  }

  async createShowtimesBulk(
    movie: Movie,
    times: string[],
    room?: string,
  ): Promise<Showtime[]> {
    const showtimes = times.map((time) =>
      this.showtimeRepository.create({
        movie,
        time,
      }),
    );

    return this.showtimeRepository.save(showtimes);
  }

  async findById(showtimeId: string): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
      relations: ['movie'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with id ${showtimeId} not found`);
    }

    return showtime;
  }

  async findByMovie(movieId: string): Promise<Showtime[]> {
    return this.showtimeRepository.find({
      where: { movie: { id: movieId } },
    });
  }

  async deleteShowtime(showtimeId: string): Promise<void> {
    const result = await this.showtimeRepository.delete(showtimeId);

    if (result.affected === 0) {
      throw new NotFoundException(`Showtime with id ${showtimeId} not found`);
    }
  }
}
