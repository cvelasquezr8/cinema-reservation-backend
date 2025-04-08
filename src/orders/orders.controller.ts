import {
  Controller,
  Post,
  Body,
  Req,
  HttpStatus,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';

// Custom imports
import { Auth, GetUser } from '@auth/decorators';
import { User } from '@auth/entities/user.entity';
import { HttpResponse } from '@common/http-response';
import { OrdersService } from '@orders/orders.service';
import { CreateOrderDto } from '@orders/dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth()
  async create(
    @Body() dto: CreateOrderDto,
    @GetUser() user: User,
    @Req() req: Request,
  ) {
    try {
      const order = await this.ordersService.create(dto, user);
      return HttpResponse.success(
        order,
        'Order created successfully',
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

  @Get(':id')
  @Auth()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Req() req: Request,
  ) {
    try {
      const order = await this.ordersService.findOne(id, user);
      return HttpResponse.success(
        order,
        'Order retrieved successfully',
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
