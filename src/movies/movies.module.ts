import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import necessary modules and decorators
import { Movie } from '@movies/entities/movies.entity';
import { MoviesService } from '@movies/movies.service';
import { MoviesController } from '@movies/movies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
