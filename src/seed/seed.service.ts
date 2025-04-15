import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Movie } from '../movies/entities/movies.entity';
import { ConfigService } from '@nestjs/config';

interface DirectorInfo {
  name: string;
  photo: string | null;
  biography: string | null;
}
@Injectable()
export class SeedService {
  private readonly apiKey: string;

  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('MOVIE_API_KEY')!;
  }

  async run() {
    const totalPages = 3;

    for (let page = 1; page <= totalPages; page++) {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/popular`,
        {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
          },
        },
      );

      for (const movie of data.results) {
        const existing = await this.movieRepository.findOneBy({
          title: movie.title,
        });
        if (existing) continue;

        const details = await this.fetchDetails(movie.id);
        const credits = await this.fetchCredits(movie.id);

        const directorEntry = credits.crew.find(
          (person) => person.job === 'Director',
        );
        const directorName = directorEntry?.name || 'Unknown';

        let directorInfo: DirectorInfo = {
          name: directorName,
          photo: null,
          biography: null,
        };

        if (directorEntry?.id) {
          try {
            const { data: personData } = await axios.get(
              `https://api.themoviedb.org/3/person/${directorEntry.id}`,
              {
                params: {
                  api_key: this.apiKey,
                  language: 'en-US',
                },
              },
            );
            directorInfo = {
              name: personData.name,
              photo: personData.profile_path
                ? `https://image.tmdb.org/t/p/w500${personData.profile_path}`
                : null,
              biography: personData.biography || null,
            };
          } catch (error) {
            console.warn(
              `No se pudo obtener info del director: ${directorName}`,
            );
          }
        }

        const cast = credits.cast.slice(0, 5).map((actor) => ({
          name: actor.name,
          character: actor.character,
          image: actor.profile_path
            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
            : null,
        }));

        await this.movieRepository.save({
          title: movie.title,
          synopsis: movie.overview,
          description: movie.overview,
          director: directorName,
          directorInfo,
          duration: details.runtime ?? 120,
          releaseYear: parseInt(movie.release_date.split('-')[0]),
          rating: movie.vote_average,
          genres: details.genres.map((g) => g.name),
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '',
          cast,
          showtimes: ['10:30', '14:15', '17:45'],
        });

        console.log(`✔️ Inserted movie: ${movie.title}`);
      }
    }
  }

  private async fetchDetails(movieId: number) {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
        },
      },
    );
    return data;
  }

  private async fetchCredits(movieId: number) {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
        },
      },
    );
    return data;
  }
}
