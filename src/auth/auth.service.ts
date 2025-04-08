import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

// Custom imports
import { User } from '@auth/entities/user.entity';
import { LoginUserDto, CreateUserDto } from '@auth/dto';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { UserWithToken } from '@common/interfaces/user-with-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly jwtService: JwtService,
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithToken> {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      const savedUser = await this.userRepository.save(user);

      return {
        id: savedUser.id,
        email: savedUser.email,
        token: this.getJwtToken({ id: savedUser.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserWithToken> {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, isActive: true },
    });

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid.');

    if (!user.isActive) throw new UnauthorizedException('User is inactive.');

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
}
