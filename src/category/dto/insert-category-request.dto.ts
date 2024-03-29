import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from '@shared/constants';

export class InsertCategoryRequestDTO {
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
  descricao!: string;

  constructor(partial: Partial<InsertCategoryRequestDTO>) {
    Object.assign(this, partial);
  }

  static build(partial: Partial<InsertCategoryRequestDTO>) {
    return new InsertCategoryRequestDTO(partial);
  }
}
