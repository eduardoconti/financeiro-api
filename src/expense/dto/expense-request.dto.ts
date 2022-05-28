import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from '@shared/constants';
import { DateHelper } from '@shared/helpers';

export class DespesasDTO {
  @ApiProperty({
    description: 'Descrição da despesa',
    example: 'Mercado',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.DESCRICAO.min, CONSTRAINTS_LIMITS.DESCRICAO.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  descricao!: string;

  @ApiProperty({ description: 'Id da categoria', example: 1 })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  categoriaId!: number;

  @ApiProperty({ description: 'Id da carteira', example: 1 })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  carteiraId!: number;

  @ApiProperty({ description: 'Numero de parcelas', default: 1, example: 1 })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  instalment!: number;

  @ApiProperty({ description: 'Valor da despesa', default: 0, example: 12.99 })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  valor!: number;

  @ApiPropertyOptional({
    description: 'Data de vencimento',
    default: DateHelper.dateNow(),
  })
  @IsDateString(undefined, { message: CONSTRAINTS_MESSAGES.IS_DATE })
  @IsOptional()
  vencimento?: Date;

  @ApiPropertyOptional({
    description: 'Data de pagamento',
    default: DateHelper.dateNow(),
  })
  @IsDateString(undefined, { message: CONSTRAINTS_MESSAGES.IS_DATE })
  @IsOptional()
  pagamento?: Date;

  @ApiPropertyOptional({ description: 'Flag Pago', default: false })
  @IsBoolean({ message: CONSTRAINTS_MESSAGES.IS_BOOLEAN })
  pago?: boolean;
}
