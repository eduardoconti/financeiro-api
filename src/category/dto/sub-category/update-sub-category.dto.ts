import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from '@shared/constants';

export class UpdateSubCategoryDTO {
  @ApiProperty({
    description: 'Descrição da sub categoria',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.DESCRICAO.min, CONSTRAINTS_LIMITS.DESCRICAO.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  description!: string;

  @ApiProperty({ description: 'Id da categoria', example: 1 })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  categoryId!: number;
}
