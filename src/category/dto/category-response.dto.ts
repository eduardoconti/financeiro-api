import { ApiProperty } from '@nestjs/swagger';

import { CONSTRAINTS_LIMITS } from '@shared/constants';

export class CategoryResponseDTO {
  @ApiProperty({
    description: 'Descrição da categoria',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
    example: 'Alimentação',
  })
  descricao!: string;

  @ApiProperty({
    description: 'ID da categoria',
    example: 1,
  })
  id!: number;
}
