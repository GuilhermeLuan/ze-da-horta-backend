import { PartialType } from '@nestjs/swagger';
import { CreateStockProductDto } from './create-stock-product.dto';

export class UpdateStockProductDto extends PartialType(CreateStockProductDto) {}
