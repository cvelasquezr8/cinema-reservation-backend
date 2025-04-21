import { Controller, Get, Post, Body, ParseUUIDPipe } from '@nestjs/common';

// Custom imports
import { AuthService } from '@auth/auth.service';
import { Auth, GetUser } from '@auth/decorators';
import {
  CreateUserDto,
  LoginUserDto,
  ResetPasswordDto,
  VerifyResetCodeDto,
} from '@auth/dto';
import { GoogleAuthDto } from '@auth/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('google')
  googleLogin(@Body() dto: GoogleAuthDto) {
    return this.authService.loginWithGoogle(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('verify-reset-code')
  verifyToken(@Body() verifyResetCode: VerifyResetCodeDto) {
    return this.authService.verifyToken(verifyResetCode.code);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('me')
  @Auth()
  getProfile(@GetUser('id', ParseUUIDPipe) userID: string) {
    return this.authService.getProfile(userID);
  }
}
