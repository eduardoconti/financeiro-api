import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from '@shared/constants';

export class InsertSubCategoryRequestDTO {
  @ApiProperty({ description: 'Id da categoria', example: 1 })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  categoryId!: number;

  @ApiProperty({
    description: 'Descrição da categoria',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
    example: 'Alimentação',
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.DESCRICAO.min, CONSTRAINTS_LIMITS.DESCRICAO.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  description!: string;

  constructor(partial: InsertSubCategoryRequestDTO) {
    Object.assign(this, partial);
  }

  static build(partial: InsertSubCategoryRequestDTO) {
    return new InsertSubCategoryRequestDTO(partial);
  }
}
