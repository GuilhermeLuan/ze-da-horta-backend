import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../user/entities/enums/user-role';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decoretor';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.CLIENT)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return this.ordersService.create(createOrderDto, +userId);
  }

  @Get()
  @Roles(UserRole.CLIENT)
  findAll(@GetUser('id') userId: string) {
    return this.ordersService.findByClient(+userId);
  }

  @Get('store')
  @Roles(UserRole.PRODUCER)
  findByStore(@GetUser('id') userId: string) {
    return this.ordersService.findByStore(+userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: UserRole,
  ) {
    return this.ordersService.findOne(id, +userId, userRole);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return this.ordersService.update(id, updateOrderDto, +userId);
  }

  @Patch(':id/status')
  @Roles(UserRole.PRODUCER)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @GetUser('id') userId: string,
  ) {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto.status,
      +userId,
    );
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CLIENT)
  cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: string,
  ) {
    return this.ordersService.cancelOrder(id, +userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.CLIENT)
  remove(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: string) {
    return this.ordersService.remove(id, +userId);
  }
}
