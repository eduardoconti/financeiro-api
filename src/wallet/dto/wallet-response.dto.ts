import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from '@shared/constants';

export class WalletResponse {
  @ApiProperty({
    description: 'Wallet id',
  })
  id!: number;

  @ApiProperty({
    description: 'Wallet description',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.DESCRICAO.min, CONSTRAINTS_LIMITS.DESCRICAO.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  descricao!: string;

  @ApiProperty({
    description: 'Status',
    example: true,
  })
  active!: boolean;
}
