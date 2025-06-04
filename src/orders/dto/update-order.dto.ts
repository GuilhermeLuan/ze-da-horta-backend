import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  deliveryAddressId?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
