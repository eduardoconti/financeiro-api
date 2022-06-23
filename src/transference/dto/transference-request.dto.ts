import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { TRANSFERENCE_CONSTRAINTS_MESSAGES } from '@transference/constants';
import { isValidWallet } from '@transference/decorators';

import { CONSTRAINTS_MESSAGES } from '@shared/constants';
import { DateHelper } from '@shared/helpers';

export class TransferenciasDTO {
  @ApiProperty()
  @IsInt({ message: CONSTRAINTS_MESSAGES.IS_INTEGER })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @isValidWallet('carteiraDestinoId', {
    message: TRANSFERENCE_CONSTRAINTS_MESSAGES.SAME_DESTINY_AND_ORIGIN_WALLET,
  })
  carteiraOrigemId!: number;

  @ApiProperty()
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsInt({ message: CONSTRAINTS_MESSAGES.IS_INTEGER })
  @isValidWallet('carteiraOrigemId', {
    message: TRANSFERENCE_CONSTRAINTS_MESSAGES.SAME_DESTINY_AND_ORIGIN_WALLET,
  })
  carteiraDestinoId!: number;

  @ApiPropertyOptional({ default: DateHelper.dateNow() })
  @IsOptional()
  @IsDateString({}, { message: CONSTRAINTS_MESSAGES.IS_DATE })
  transferencia?: Date;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: CONSTRAINTS_MESSAGES.IS_BOOLEAN })
  pago?: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsInt({ message: CONSTRAINTS_MESSAGES.IS_INTEGER })
  @IsInt({ message: CONSTRAINTS_MESSAGES.IS_INTEGER })
  valor!: number;
}
