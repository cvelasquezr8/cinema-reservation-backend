import { Controller, Get, Post, Body, Req, HttpStatus } from '@nestjs/common';

// Custom imports
import { AuthService } from '@auth/auth.service';
import { Auth, GetUser } from '@auth/decorators';
import { User } from '@auth/entities/user.entity';
import {
  CreateUserDto,
  LoginUserDto,
  ResetPasswordDto,
  VerifyResetCodeDto,
} from '@auth/dto';
import { HttpResponse, StandardHttpResponse } from '@common/http-response';
import { UserWithToken } from '@common/interfaces/user-with-token.interface';
import { GoogleAuthDto } from '@auth/dto';

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

  @Post('google')
  async googleLogin(@Body() dto: GoogleAuthDto, @Req() req: Request) {
    try {
      const result = await this.authService.loginWithGoogle(dto);
      return HttpResponse.success(
        result,
        'Login with Google successful',
        HttpStatus.OK,
        req.url,
      );
    } catch (error) {
      return HttpResponse.error(
        error.message || 'Login failed',
        error.status || HttpStatus.UNAUTHORIZED,
        req.url,
      );
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string, @Req() req: Request) {
    try {
      const result = await this.authService.forgotPassword(email);
      return HttpResponse.success(
        result,
        'Password reset link sent',
        HttpStatus.OK,
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

  @Post('verify-reset-code')
  async verifyToken(
    @Body() verifyResetCode: VerifyResetCodeDto,
    @Req() req: Request,
  ) {
    try {
      const result = await this.authService.verifyToken(verifyResetCode.code);
      return HttpResponse.success(
        result,
        'Token verified',
        HttpStatus.OK,
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

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: Request,
  ) {
    try {
      const result = await this.authService.resetPassword(resetPasswordDto);
      return HttpResponse.success(
        result,
        'Password reset successful',
        HttpStatus.OK,
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
}
