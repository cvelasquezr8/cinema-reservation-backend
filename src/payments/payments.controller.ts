import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Auth, GetUser } from '@auth/decorators';
import { CreatePaymentAndReservationDto } from './dto/create-payment-reservation.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  @Auth()
  async createPaymentIntent(
    @Body() paymentReservationDto: CreatePaymentAndReservationDto,
    @GetUser('id') userId: string,
  ) {
    return this.paymentsService.createPaymentIntent(
      paymentReservationDto,
      userId,
    );
  }
}
