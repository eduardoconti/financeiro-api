import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from '@shared/constants';

export class UpdateWalletRequest {
  @ApiPropertyOptional({
    description: 'Descrição da carteira',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.DESCRICAO.min, CONSTRAINTS_LIMITS.DESCRICAO.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  description!: string;

  @ApiPropertyOptional({
    description: 'Status',
    example: true,
  })
  @IsBoolean({ message: CONSTRAINTS_MESSAGES.IS_BOOLEAN })
  @IsOptional()
  active?: boolean;
}
