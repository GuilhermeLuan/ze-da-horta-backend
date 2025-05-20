import { UserRole } from '../entities/user-role';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail não pode estar vazio.' })
  email: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @IsString({ message: 'A senha deve ser um texto.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;

  @IsEnum(UserRole, { message: 'Tipo de usuário inválido.' })
  @IsNotEmpty({ message: 'O tipo de usuário (role) não pode estar vazio.' })
  role: UserRole;

  @ValidateIf(
    (object) =>
      object.role === UserRole.CLIENT || object.role === UserRole.DELIVERY,
  )
  @IsNotEmpty({ message: 'CPF é obrigatório para clientes e entregadores.' })
  @IsString({ message: 'CPF deve ser um texto.' })
  cpf?: string;

  @ValidateIf((object) => object.role === UserRole.DELIVERY)
  @IsNotEmpty({ message: 'CNH é obrigatória para entregadores.' })
  @IsString({ message: 'CNH deve ser um texto.' })
  cnh?: string;

  @ValidateIf((object) => object.role === UserRole.PRODUCER)
  @IsNotEmpty({ message: 'CNPJ é obrigatório para produtores.' })
  @IsString({ message: 'CNPJ deve ser um texto.' })
  cnpj?: string;
}
