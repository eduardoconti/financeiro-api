import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from '@shared/constants';

export class CarteirasDTO {
  @ApiPropertyOptional({
    description: 'uuid do usuario',
  })
  @IsUUID('4')
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Descrição da carteira',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.DESCRICAO.min, CONSTRAINTS_LIMITS.DESCRICAO.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  descricao!: string;
}
