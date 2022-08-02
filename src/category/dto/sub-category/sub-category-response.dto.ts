import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from '@shared/constants';

export class SubCategoryResponseDTO {
  @ApiProperty({
    description: 'Descrição da sub categoria',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
    example: 'Lanche',
  })
  description!: string;

  @ApiProperty({
    description: 'ID da sub categoria',
    example: 1,
  })
  id!: number;

  @ApiProperty({ description: 'Id da categoria', example: 1 })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  categoryId!: number;
}
