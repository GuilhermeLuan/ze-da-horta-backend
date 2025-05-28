import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockProductService } from './stock-product.service';
import { CreateStockProductDto } from './dto/create-stock-product.dto';
import { UpdateStockProductDto } from './dto/update-stock-product.dto';

@Controller('stock-product')
export class StockProductController {
  constructor(private readonly stockProductService: StockProductService) {}

  @Post()
  create(@Body() createStockProductDto: CreateStockProductDto) {
    return this.stockProductService.create(createStockProductDto);
  }

  @Get()
  findAll() {
    return this.stockProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockProductDto: UpdateStockProductDto) {
    return this.stockProductService.update(+id, updateStockProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockProductService.remove(+id);
  }
}
