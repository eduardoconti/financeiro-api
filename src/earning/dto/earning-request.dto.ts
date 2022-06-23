import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from '@shared/constants';
import { DateHelper } from '@shared/helpers';

export class ReceitasDTO {
  @ApiProperty({
    description: 'Descrição da receita',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
  })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.DESCRICAO.min, CONSTRAINTS_LIMITS.DESCRICAO.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  descricao!: string;

  @ApiProperty({ default: 0 })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsInt({ message: CONSTRAINTS_MESSAGES.IS_INTEGER })
  valor!: number;

  @ApiPropertyOptional({
    description: 'Data de vencimento',
    default: DateHelper.dateNow(),
  })
  @IsDateString({}, { message: CONSTRAINTS_MESSAGES.IS_DATE })
  @IsOptional()
  pagamento?: Date;

  @ApiPropertyOptional({ default: false })
  @IsBoolean({ message: CONSTRAINTS_MESSAGES.IS_BOOLEAN })
  @IsOptional()
  pago?: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsInt({ message: CONSTRAINTS_MESSAGES.IS_INTEGER })
  carteiraId!: number;

  constructor(partial: Partial<ReceitasDTO>) {
    Object.assign(this, partial);
  }

  static build(partial: Partial<ReceitasDTO>): ReceitasDTO {
    return new ReceitasDTO(partial);
  }
}
