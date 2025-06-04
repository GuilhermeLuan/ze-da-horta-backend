import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { Store } from '../store/entities/store.entity';
import { Address } from '../address/entities/address.entity';
import { ClientProfile } from '../user/entities/client-profile.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Product,
      Store,
      Address,
      ClientProfile,
      Cart,
      CartItem,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, CartService],
  exports: [OrdersService],
})
export class OrdersModule {}
