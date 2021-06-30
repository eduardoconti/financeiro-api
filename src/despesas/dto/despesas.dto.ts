import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { Carteiras } from 'src/carteiras/entity/carteiras.entity';
import { Categorias } from 'src/categorias/entity/categorias.entity';
import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from 'src/shared/constants';
import { Users } from 'src/users/entity/users.entity';

export class DespesasDTO {
  @ApiProperty({
    description: 'uuid do usuario',
  })
  @IsUUID('4')
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  user: Users;

  @ApiProperty({
    description: 'Descrição da despesa',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.DESCRICAO.min, CONSTRAINTS_LIMITS.DESCRICAO.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  descricao: string;

  @ApiProperty({ description: 'Id da categoria' })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  //@IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  categoria: Categorias;

  @ApiProperty({ description: 'Id da carteira' })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  //@IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  carteira: Carteiras;

  @ApiProperty({ description: 'Valor da despesa', default: 0 })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  valor: number;

  @ApiPropertyOptional({
    description: 'Data de vencimento',
    default: new Date(),
  })
  @IsDateString(null, { message: CONSTRAINTS_MESSAGES.IS_DATE })
  @IsOptional()
  vencimento: Date;

  @ApiPropertyOptional({
    description: 'Data de pagamento',
    default: new Date(),
  })
  @IsDateString(null, { message: CONSTRAINTS_MESSAGES.IS_DATE })
  @IsOptional()
  pagamento?: Date;

  @ApiPropertyOptional({ description: 'Flag Pago', default: false })
  @IsBoolean({ message: CONSTRAINTS_MESSAGES.IS_BOOLEAN })
  pago: boolean;
}
