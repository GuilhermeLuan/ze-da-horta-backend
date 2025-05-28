import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { User } from '../user/entities/user.entity';
import { Store } from './entities/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Store]), ProductsModule],
  controllers: [StoreController],
  providers: [StoreService, ProductsService],
})
export class StoreModule {}
