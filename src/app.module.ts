import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

// Importing the modules
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { SeatsModule } from '@seats/seats.module';
import { RoomsModule } from '@rooms/rooms.module';
import { MoviesModule } from '@movies/movies.module';
import { OrdersModule } from '@orders/orders.module';
import { ShowtimesModule } from '@showtimes/showtimes.module';
import { ReservationsModule } from '@reservations/reservations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    MoviesModule,
    UsersModule,
    ReservationsModule,
    OrdersModule,
    ShowtimesModule,
    SeatsModule,
    RoomsModule,
  ],
})
export class AppModule {}
