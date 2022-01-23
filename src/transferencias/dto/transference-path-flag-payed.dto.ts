import { ApiProperty } from '@nestjs/swagger';
import { CONSTRAINTS_MESSAGES } from '@shared/constants';
import { IsBoolean } from 'class-validator';

export class TransferencePathFlagPayedDTO {
  @ApiProperty({ description: 'Flag Pago' })
  @IsBoolean({ message: CONSTRAINTS_MESSAGES.IS_BOOLEAN })
  pago!: boolean;
}
