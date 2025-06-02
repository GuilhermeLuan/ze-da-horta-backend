// create-cart.dto.ts
import { IsOptional, IsNumber, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCartDto {
    @IsOptional()
    @IsNumber({}, { message: 'ID do cliente inválido. Deve ser um número.' })
    clientProfileId?: number;

    //  @IsOptional()
    //  @IsArray({ message: 'Lista de produtos inválida. Deve ser um array.' })
    //  @ValidateNested({ each: true })
    //  @Type(() => CreateCartItemDto)
    //  items?: CreateCartItemDto[];

    items?: any[]; // Temporarily using 'any' type for items, should be replaced with a proper DTO later

    @IsOptional()
    @IsNumber({}, { message: 'Valor total inválido. Deve ser um número.' })
    @Min(0, { message: 'O valor total do carrinho deve ser igual ou maior que R$ 0,00' })
    @Type(() => Number)
    totalValue?: number = 0;
}