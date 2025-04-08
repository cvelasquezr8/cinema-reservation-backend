import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem, Payment } from './entities';
import { UsersModule } from '@users/users.module';
import { ReservationsModule } from '@reservations/reservations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Payment]),
    UsersModule,
    ReservationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [TypeOrmModule],
})
export class OrdersModule {}
