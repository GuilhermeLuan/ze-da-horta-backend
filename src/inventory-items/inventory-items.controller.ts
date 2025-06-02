import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, UseGuards,
} from '@nestjs/common';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryItemsService } from './inventory-items.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/enums/user-role';

@Controller('store/:storeId/inventory-items')
export class InventoryItemsController {
  constructor(private readonly inventoryItemsService: InventoryItemsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  getInventory(@Param('storeId') storeId: string) {
    return this.inventoryItemsService.getStockInventory(+storeId);
  }

  @Get('summary')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  getStockSummary(@Param('storeId') storeId: string) {
    return this.inventoryItemsService.getStockSummary(+storeId);
  }

  @Get('out-of-stock')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  getOutOfStockItems(@Param('storeId') storeId: string) {
    return this.inventoryItemsService.getOutOfStockItems(+storeId);
  }

  @Get('products/:productId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
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
