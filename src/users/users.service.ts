import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Order } from '@orders/entities';
import { Reservation } from '@reservations/entities/reservation.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string, currentUser: User) {
    if (id !== currentUser.id && !isAdmin(currentUser)) {
      throw new ForbiddenException(
        `You are not allowed to get information about this user ${id}`,
      );
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user)
      throw new BadRequestException(`User with id ${id} not found or deleted`);

    return user;
  }

  async update(id: string, currentUser: User, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id, currentUser);
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string, currentUser: User) {
    const user = await this.findOne(id, currentUser);
    return this.usersRepository.softDelete(id);
  }

  async getOrdersByUser(id: string, currentUser: User) {
    const user = await this.findOne(id, currentUser);
    const orders = await this.orderRepository.find({
      where: { user: { id: user.id } },
      relations: ['items', 'items.reservation', 'payment'],
    });

    return orders;
  }

  async getReservationsByUser(id: string, currentUser: User) {
    const user = await this.findOne(id, currentUser);
    const reservations = await this.reservationRepository.find({
      where: { user: { id: user.id } },
      relations: ['showtime', 'seat'],
    });

    return reservations;
  }
}

function isAdmin(user: User): boolean {
  return user.roles.some((role) => ['admin', 'super-user'].includes(role));
}
