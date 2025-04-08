import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// Custom imports
import { User } from '@auth/entities/user.entity';
import { Order, OrderItem } from '@orders/entities';
import { CreateOrderDto } from '@orders/dto/create-order.dto';
import { Reservation } from '@reservations/entities/reservation.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(dto: CreateOrderDto, user: User) {
    const reservations = await this.reservationRepository.find({
      where: dto.reservationIds.map((id) => ({ id })),
      relations: ['user'],
    });

    if (reservations.length !== dto.reservationIds.length) {
      throw new BadRequestException('Some reservations do not exist');
    }

    const notOwned = reservations.find((res) => res.user.id !== user.id);
    if (notOwned) {
      throw new ForbiddenException(
        'One or more reservations do not belong to you',
      );
    }

    const order = this.orderRepository.create({
      user,
      items: reservations.map((res) =>
        this.orderItemRepository.create({ reservation: res }),
      ),
      totalAmount: reservations.length * 5, // Assuming each reservation costs $5
    });

    return this.orderRepository.save(order);
  }

  async findOne(id: string, currentUser: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'user',
        'items',
        'items.reservation',
        'items.reservation.seat',
        'items.reservation.showtime',
        'items.reservation.showtime.movie',
      ],
    });

    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    const isOwner = order.user.id === currentUser.id;
    const isAdmin = currentUser.roles.some((role) =>
      ['admin', 'super-user'].includes(role),
    );

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You are not allowed to view this order');
    }

    return order;
  }
}
