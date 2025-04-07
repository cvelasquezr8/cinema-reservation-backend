import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CastMemberDto {
  @IsString()
  name: string;

  @IsString()
  character: string;

  @IsUrl()
  image: string;
}

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  synopsis: string;

  @IsString()
  director: string;

  @IsInt()
  duration: number;

  @IsInt()
  releaseYear: number;

  @IsNumber()
  rating: number;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsUrl()
  posterUrl: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CastMemberDto)
  cast?: CastMemberDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  showtimes?: string[];
}
