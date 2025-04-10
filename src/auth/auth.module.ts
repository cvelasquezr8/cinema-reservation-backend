import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Custom imports
import { AuthService } from '@auth/auth.service';
import { User, PasswordReset } from '@auth/entities';
import { AuthController } from '@auth/auth.controller';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { UserRoleGuard } from '@auth/guards/user-role.guard';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserRoleGuard],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, PasswordReset]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    AuthService,
    UserRoleGuard,
  ],
})
export class AuthModule {}
