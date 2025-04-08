import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Reservation } from '@reservations/entities/reservation.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @OneToOne(() => Reservation, (reservation) => reservation.orderItem)
  @JoinColumn()
  reservation: Reservation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
