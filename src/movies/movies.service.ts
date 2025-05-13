import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

// Import necessary entities and DTOs
import { Movie } from '@movies/entities/movies.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  findAll(search?: string, genre?: string): Promise<Movie[]> {
    const query = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.showtimes', 'showtime');

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
      relations: ['showtimes'],
    });

    if (!movie)
      throw new BadRequestException(`Movie with id ${id} not found or deleted`);

    return movie;
  }
}
