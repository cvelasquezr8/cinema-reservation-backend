import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { HttpResponse } from '@common/http-response';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get(':id/seats')
  async getSeatsByRoomId(
    @Param('id', ParseUUIDPipe) roomId: string,
    @Req() req: Request,
  ) {
    try {
      const seats = await this.roomsService.getSeatsByRoomId(roomId);
      return HttpResponse.success(
        seats,
        'Seats fetched successfully',
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
