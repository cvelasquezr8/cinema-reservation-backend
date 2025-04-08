import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import the UsersService and UsersController
import { User } from '@auth/entities/user.entity';
import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';
import { OrdersModule } from '@orders/orders.module';
import { ReservationsModule } from '@reservations/reservations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => OrdersModule),
    forwardRef(() => ReservationsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
