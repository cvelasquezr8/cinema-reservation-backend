import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';

// Import necessary modules and decorators
import { ValidRoles } from '@auth/interfaces';
import { Auth, GetUser } from '@auth/decorators';
import { User } from '@auth/entities/user.entity';
import { UsersService } from '@users/users.service';
import { HttpResponse } from '@common/http-response';
import { UpdateUserDto } from '@users/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  async findAll(@Req() req: Request) {
    try {
      const users = await this.usersService.findAll();
      return HttpResponse.success(
        users,
        'Users retrieved successfully',
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

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: User,
    @Req() req: Request,
  ) {
    try {
      const user = await this.usersService.findOne(id, currentUser);
      return HttpResponse.success(
        user,
        'User retrieved successfully',
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

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() currentUser: User,
    @Req() req: Request,
  ) {
    try {
      const user = await this.usersService.update(
        id,
        currentUser,
        updateUserDto,
      );

      return HttpResponse.success(
        user,
        'User updated successfully',
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

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: User,
    @Req() req: Request,
  ) {
    try {
      const user = await this.usersService.remove(id, currentUser);
      return HttpResponse.success(
        user,
        'User deleted successfully',
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

  @Get(':id/orders')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
  async getOrders(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Req() req: Request,
  ) {
    try {
      const userOrders = await this.usersService.getOrdersByUser(id, user);
      return HttpResponse.success(
        userOrders,
        'User orders retrieved successfully',
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

  @Get(':id/reservations')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
  async getReservations(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Req() req: Request,
  ) {
    try {
      const userReservations = await this.usersService.getReservationsByUser(
        id,
        user,
      );
      return HttpResponse.success(
        userReservations,
        'User reservations retrieved successfully',
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
