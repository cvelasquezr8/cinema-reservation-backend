import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

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

  @Column({ type: 'text' })
  description: string;

  @Column('jsonb', { nullable: true })
  cast: { name: string; character: string; image: string }[];

  @Column('jsonb', { nullable: true })
  showtimes: string[]; // Ej: ["10:30", "14:15", "17:45"]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
