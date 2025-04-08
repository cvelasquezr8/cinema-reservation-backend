import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Req,
  ParseUUIDPipe,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

// Import necessary modules and decorators
import { Auth } from '@auth/decorators';
import { ValidRoles } from '@auth/interfaces';
import { HttpResponse } from '@common/http-response';
import { MoviesService } from '@movies/movies.service';
import { CreateMovieDto, UpdateMovieDto } from '@movies/dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Auth()
  async create(@Body() createMovieDto: CreateMovieDto, @Req() req: Request) {
    try {
      const movie = await this.moviesService.create(createMovieDto);
      return HttpResponse.success(
        movie,
        'Movie created successfully',
        HttpStatus.CREATED,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        req.url,
      );
    }
  }

  @Get()
  async findAll(
    @Query('search') search: string,
    @Query('genre') genre: string,
    @Req() req: Request,
  ) {
    try {
      const movies = await this.moviesService.findAll(search, genre);
      return HttpResponse.success(
        movies,
        'Movies retrieved successfully',
        HttpStatus.OK,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        req.url,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    try {
      const movie = await this.moviesService.findOne(id);
      return HttpResponse.success(
        movie,
        'Movie retrieved successfully',
        HttpStatus.OK,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message,
        error.status || HttpStatus.NOT_FOUND,
        req.url,
      );
    }
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @Req() req: Request,
  ) {
    try {
      const movie = await this.moviesService.update(id, updateMovieDto);
      return HttpResponse.success(
        movie,
        'Movie updated successfully',
        HttpStatus.OK,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        req.url,
      );
    }
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    try {
      const movie = await this.moviesService.remove(id);
      return HttpResponse.success(
        movie,
        'Movie deleted successfully',
        HttpStatus.OK,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        req.url,
      );
    }
  }
}
