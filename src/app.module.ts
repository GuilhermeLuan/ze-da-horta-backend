import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from './store/store.module';
import { ProductsModule } from './products/products.module';
import { StockModule } from './stock/stock.module';
import { InventoryItemsModule } from './inventory-items/inventory-items.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    StoreModule,
    ProductsModule,
    StockModule,
    InventoryItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
