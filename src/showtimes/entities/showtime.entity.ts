import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Custom imports
import { Movie } from '@movies/entities/movies.entity';
import { Room } from '@rooms/entities/room.entity';
import { Reservation } from '@reservations/entities/reservation.entity';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  movie: Movie;

  @ManyToOne(() => Room, (room) => room.showtimes)
  room: Room;

  @OneToMany(() => Reservation, (reservation) => reservation.showtime)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
