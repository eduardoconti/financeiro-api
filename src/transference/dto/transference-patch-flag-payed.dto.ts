import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CONSTRAINTS_MESSAGES } from 'src/shared/constants';

export class TransferencePatchFlagPayedDTO {
  @ApiProperty({ description: 'Flag Pago' })
  @IsBoolean({ message: CONSTRAINTS_MESSAGES.IS_BOOLEAN })
  pago!: boolean;
}
