import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { CONSTRAINTS_MESSAGES } from 'src/shared/constants';

export class TransferenciasDTO {
  @ApiProperty({
    description: 'uuid do usuario',
  })
  @IsUUID('4')
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  user!: string;

  @ApiProperty()
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  carteiraOrigem!: number;

  @ApiProperty()
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  carteiraDestino!: number;

  @ApiPropertyOptional({ default: new Date() })
  @IsOptional()
  @IsDateString({}, { message: CONSTRAINTS_MESSAGES.IS_DATE })
  transferencia!: Date;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: CONSTRAINTS_MESSAGES.IS_BOOLEAN })
  pago!: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  valor!: number;
}
