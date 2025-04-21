import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

// Import necessary entities and DTOs
import { Movie } from '@movies/entities/movies.entity';
import { CreateMovieDto, UpdateMovieDto } from '@movies/dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  findAll(search?: string, genre?: string): Promise<Movie[]> {
    const query = this.movieRepository.createQueryBuilder('movie');

    if (search) {
      const normalized = `%${search.toLowerCase()}%`;

      query.andWhere(
        `(
          LOWER(movie.title) LIKE :search OR
          LOWER(movie.director) LIKE :search OR
          movie.cast::text ILIKE :search
        )`,
        { search: normalized },
      );
    }

    if (genre && genre.toLowerCase() !== 'all') {
      query.andWhere(`:genre = ANY (movie.genres)`, { genre });
    }

    query.orderBy('movie.rating', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!movie)
      throw new BadRequestException(`Movie with id ${id} not found or deleted`);

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOne(id);
    this.movieRepository.merge(movie, updateMovieDto);
    return this.movieRepository.save(movie);
  }

  async remove(id: string) {
    const movie = await this.findOne(id);
    return this.movieRepository.softDelete(id);
  }
}
