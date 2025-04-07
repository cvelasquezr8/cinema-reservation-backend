import { Controller, Get, Post, Body, Req, HttpStatus } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

import { Auth, GetUser } from './decorators/';
import { HttpResponse, StandardHttpResponse } from 'src/common/http-response';
import { UserWithToken } from 'src/common/interfaces/user-with-token.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ): Promise<StandardHttpResponse<any>> {
    try {
      const user = await this.authService.create(createUserDto);
      return HttpResponse.success(
        user,
        'User registered',
        HttpStatus.CREATED,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        req.url,
      );
    }
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Req() req: Request,
  ): Promise<StandardHttpResponse<any>> {
    try {
      const user = await this.authService.login(loginUserDto);
      return HttpResponse.success(
        user,
        'Login successful',
        HttpStatus.OK,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message,
        error.status || HttpStatus.UNAUTHORIZED,
        req.url,
      );
    }
  }

  @Get('check-status')
  @Auth()
  async checkAuthStatus(
    @GetUser() user: User,
    @Req() req: Request,
  ): Promise<StandardHttpResponse<UserWithToken>> {
    const result = await this.authService.checkAuthStatus(user);
    return HttpResponse.success<UserWithToken>(
      result,
      'Auth status valid',
      HttpStatus.OK,
      req.url,
    );
  }
}
