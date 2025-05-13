import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Showtime } from '@showtimes/entities/showtime.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  synopsis: string;

  @Column()
  director: string;

  @Column('jsonb', { nullable: true })
  directorInfo: {
    name: string;
    photo: string | null;
    biography: string | null;
  };

  @Column('int')
  duration: number; // in minutes

  @Column()
  releaseYear: number;

  @Column('float')
  rating: number;

  @Column('simple-array')
  genres: string[]; // Ej: ["Action", "Sci-Fi", "Thriller"]

  @Column()
  posterUrl: string;

  @Column()
  backdropUrl: string;

  @Column({ type: 'text' })
  description: string;

  @Column('jsonb', { nullable: true })
  cast: { name: string; character: string; image: string }[];

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
