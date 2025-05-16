import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transactionId: string;

  @Column()
  type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column()
  date: string;

  @CreateDateColumn()
  createdAt: Date;
}
