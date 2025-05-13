import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

// Import necessary modules and decorators
import { MoviesService } from '@movies/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll(@Query('search') search: string, @Query('genre') genre: string) {
    return this.moviesService.findAll(search, genre);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.findOne(id);
  }
}
