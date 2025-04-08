import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

// Custom imports
import { User } from '@auth/entities/user.entity';
import { Seat } from '@seats/entities/seat.entity';
import { Showtime } from '@showtimes/entities/showtime.entity';
import { OrderItem } from '@orders/entities/order-item.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  reservationTime: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Showtime, (showtime) => showtime.reservations)
  showtime: Showtime;

  @ManyToOne(() => Seat)
  seat: Seat;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.reservation)
  orderItem: OrderItem;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
