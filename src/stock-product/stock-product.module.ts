import { Module } from '@nestjs/common';
import { StockProductService } from './stock-product.service';
import { StockProductController } from './stock-product.controller';

@Module({
  controllers: [StockProductController],
  providers: [StockProductService],
})
export class StockProductModule {}
