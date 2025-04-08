import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentMethod: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  amount: number;

  @CreateDateColumn()
  paymentTime: Date;

  @Column()
  status: string;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn()
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
