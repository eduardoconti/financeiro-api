import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';

import { Instalment } from '@expense/decorators';

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
  @Min(1)
  categoriaId!: number;

  @ApiProperty({ description: 'Id da sub categoria', example: 1 })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  @Min(1)
  subCategoryId!: number;

  @ApiProperty({ description: 'Id da carteira', example: 1 })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  @Min(1)
  carteiraId!: number;

  @ApiProperty({ description: 'Numero de parcelas', default: 1, example: 1 })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  @Min(1)
  @IsInt({ message: CONSTRAINTS_MESSAGES.IS_INTEGER })
  @Instalment('valor', { message: CONSTRAINTS_MESSAGES.INSTALMENT })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  instalment!: number;

  @ApiProperty({
    description: 'Valor da despesa em centavos',
    default: 0,
    example: 1299,
  })
  @IsInt({ message: CONSTRAINTS_MESSAGES.IS_INTEGER })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  @Min(0)
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
  @ValidateIf(o => o.pago !== undefined)
  @IsBoolean({ message: CONSTRAINTS_MESSAGES.IS_BOOLEAN })
  pago?: boolean;

  constructor(partial: Partial<DespesasDTO>) {
    Object.assign(this, partial);
  }

  static build(partial: Partial<DespesasDTO>): DespesasDTO {
    return new DespesasDTO(partial);
  }
}
