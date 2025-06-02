import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryItemsService } from './inventory-items.service';

@Controller('store/:storeId/inventory-items')
export class InventoryItemsController {
  constructor(private readonly inventoryItemsService: InventoryItemsService) {}

  @Post()
  addProduct(
    @Param('storeId') storeId: string,
    @Body() createInventoryItemDto: CreateInventoryItemDto,
  ) {
    return this.inventoryItemsService.addProductToStock(
      +storeId,
      createInventoryItemDto,
    );
  }

  @Get()
  getInventory(@Param('storeId') storeId: string) {
    return this.inventoryItemsService.getStockInventory(+storeId);
  }

  @Get('summary')
  getStockSummary(@Param('storeId') storeId: string) {
    return this.inventoryItemsService.getStockSummary(+storeId);
  }

  @Get('out-of-stock')
  getOutOfStockItems(@Param('storeId') storeId: string) {
    return this.inventoryItemsService.getOutOfStockItems(+storeId);
  }

  @Get('products/:productId')
  getInventoryItemByProduct(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    return this.inventoryItemsService.getInventoryItemByProduct(
      +storeId,
      +productId,
    );
  }

  @Patch('products/:productId')
  updateInventoryItem(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body() updateInventoryItemDto: UpdateInventoryItemDto,
  ) {
    return this.inventoryItemsService.updateInventoryItem(
      +storeId,
      +productId,
      updateInventoryItemDto,
    );
  }

  @Patch('products/:productId/decrease')
  decreaseStock(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryItemsService.decreaseStock(
      +storeId,
      +productId,
      quantity,
    );
  }

  @Patch('products/:productId/increase')
  increaseStock(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryItemsService.increaseStock(
      +storeId,
      +productId,
      quantity,
    );
  }

  @Delete('products/:productId')
  removeProduct(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    return this.inventoryItemsService.removeProductFromStock(
      +storeId,
      +productId,
    );
  }
}
