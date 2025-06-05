import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber({}, { message: 'A avaliação deve ser um número.' })
  @Min(1, { message: 'A avaliação deve ser no mínimo 1.' })
  @Max(5, { message: 'A avaliação deve ser no máximo 5.' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'O comentário deve ser um texto.' })
  comment?: string;

  @IsNumber({}, { message: 'O ID do pedido deve ser um número.' })
  @IsNotEmpty({ message: 'O ID do pedido é obrigatório.' })
  orderId: number;
}
