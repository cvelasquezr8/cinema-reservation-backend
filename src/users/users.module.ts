import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import the UsersService and UsersController
import { User } from '@auth/entities/user.entity';
import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
