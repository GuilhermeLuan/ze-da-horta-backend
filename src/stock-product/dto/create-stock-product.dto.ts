import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class CreateStockProductDto {
  @IsNumber()
  @Type(() => Number)
  productId: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;
}
