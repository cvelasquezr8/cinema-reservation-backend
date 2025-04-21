import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

// Custom imports
import { User, PasswordReset } from '@auth/entities';
import {
  LoginUserDto,
  CreateUserDto,
  GoogleAuthDto,
  ResetPasswordDto,
} from '@auth/dto';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { UserWithToken } from '@common/interfaces/user-with-token.interface';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@mail/mail.service';

@Injectable()
export class AuthService {
  private readonly googleClientID: string;
  private readonly googleTokenURL: string;
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    this.googleClientID = this.configService.get<string>(
      'GOOGLE_API_TOKEN_ID',
    )!;

    this.googleTokenURL = this.configService.get<string>(
      'GOOGLE_API_ACCESS_TOKEN_URL',
    )!;
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithToken> {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: hashPassword(password),
      });

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User ${savedUser.email} registered`);
      return {
        id: savedUser.id,
        email: savedUser.email,
        token: this.getJwtToken({ id: savedUser.id }),
      };
    } catch (error) {
      this.logger.error(`Error registering user: ${error.message}`);
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserWithToken> {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, isActive: true },
    });

    if (
      !user ||
      user.password === 'google-auth' ||
      !bcrypt.compareSync(password, user.password)
    )
      throw new UnauthorizedException('Credentials are not valid.');

    if (!user.isActive) throw new UnauthorizedException('User is inactive.');
    this.logger.log(`User ${user.email} logged in`);
    return {
      id: user.id,
      email: user.email,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User): Promise<UserWithToken> {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check server logs');
  }

  async verifyGoogleToken(googleDto: GoogleAuthDto) {
    const { data } = await axios.get(
      `${this.googleClientID}=${googleDto.idToken}`,
    );

    if (!data.email_verified) {
      throw new UnauthorizedException('Email not verified');
    }

    try {
      const { data: userInfo } = await axios.get(this.googleTokenURL, {
        headers: {
          Authorization: `Bearer ${googleDto.accessToken}`,
        },
      });

      if (!userInfo.email_verified) {
        throw new UnauthorizedException('Email not verified');
      }

      if (userInfo.email !== data.email) {
        throw new UnauthorizedException('Email does not match');
      }

      this.logger.log(`User ${userInfo.email} logged in with Google`);
      return {
        email: userInfo.email,
        fullName: userInfo.name,
        picture: userInfo.picture,
      };
    } catch (error) {
      this.logger.error(`Error verifying Google token: ${error.message}`);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async loginWithGoogle(googleDto: GoogleAuthDto) {
    const { email, fullName, picture } =
      await this.verifyGoogleToken(googleDto);

    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = this.userRepository.create({
        email,
        fullName,
        isActive: true,
        roles: ['user'],
        photoUrl: picture,
        isGoogleUser: true,
      });
      await this.userRepository.save(user);
    } else if (!user.isActive) {
      this.logger.error(`User ${user.email} is inactive`);
      throw new UnauthorizedException(
        'User is inactive. Please contact support.',
      );
    }

    const payload = { id: user.id, email: user.email, roles: user.roles };
    const token = this.jwtService.sign(payload);
    this.logger.log(`User ${user.email} logged in with Google`);
    return {
      token,
      user,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true, isGoogleUser: false },
    });

    if (!user) throw new BadRequestException('User not found or inactive');

    try {
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // 1. Delete any existing password reset tokens for the user
      await this.passwordResetRepository.delete({ user: { id: user.id } });

      // 2. Create a new password reset token
      const resetToken = this.passwordResetRepository.create({
        user,
        code,
        expiresAt,
      });

      await this.passwordResetRepository.save(resetToken);

      // 3. Send email with the reset link
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
          <h2 style="color: #4A90E2;">🔐 Password Recovery</h2>
          <p>Hi <strong>${user.fullName}</strong>,</p>
          <p>You recently requested to reset your password.</p>
          <p>Your 6-digit recovery code is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #000; background: #f1f1f1; padding: 10px 20px; display: inline-block; border-radius: 5px;">
            ${code}
          </p>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <br/>
          <p style="font-size: 12px; color: #888;">— The CineApp Team 🎬</p>
        </div>
      `;

      const subject = 'Password Recovery';
      const to = user.email;
      await this.mailService.sendMail({ to, subject, html });

      this.logger.log(`Password reset email sent to ${user.email}`);
      return { isSent: true };
    } catch (error) {
      this.logger.error(`Error sending password reset email: ${error.message}`);
      throw new InternalServerErrorException(
        'Error sending password reset email',
      );
    }
  }

  async verifyToken(token: string) {
    const tokenRecord = await this.passwordResetRepository.findOne({
      where: { code: token },
      relations: ['user'],
    });

    if (
      !tokenRecord ||
      !tokenRecord.user ||
      !tokenRecord.user.isActive ||
      !isTokenValid(tokenRecord.expiresAt) ||
      tokenRecord.user.deletedAt
    ) {
      throw new BadRequestException('Invalid user or expired token');
    }

    this.logger.log(`Token ${token} verified successfully`);
    return { isValidToken: true, userID: tokenRecord.user.id };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { userID } = await this.verifyToken(resetPasswordDto.code);
    const { newPassword } = resetPasswordDto;
    const passwordHashed = hashPassword(newPassword);

    await this.userRepository.update(userID, {
      password: passwordHashed,
    });

    await this.passwordResetRepository.delete({ user: { id: userID } });

    this.logger.log(`User ${userID} password reset successfully`);
    return { isUpdated: true };
  }

  async getProfile(userID: string) {
    const user = await this.userRepository.findOneBy({ id: userID });
    if (!user)
      throw new BadRequestException(`User not found with id ${userID}`);

    return user;
  }
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isTokenValid(expiresAt: Date): boolean {
  return expiresAt > new Date();
}

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}
