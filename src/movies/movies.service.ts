import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Movie } from './entities/movies.entity';
import { CreateMovieDto, UpdateMovieDto } from './dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  create(createMovieDto: CreateMovieDto) {
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  findAll() {
    return this.moviesRepository.find({});
  }

  async findOne(id: string) {
    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) throw new BadRequestException(`Movie with id ${id} not found`);
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOne(id);
    this.moviesRepository.merge(movie, updateMovieDto);
    return this.moviesRepository.save(movie);
  }

  async remove(id: string) {
    const movie = await this.findOne(id);
    return this.moviesRepository.remove(movie);
  }
}
