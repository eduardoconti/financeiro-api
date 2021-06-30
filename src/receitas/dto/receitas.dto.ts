import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { Carteiras } from 'src/carteiras/entity/carteiras.entity';
import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from 'src/shared/constants';
import { Users } from 'src/users/entity/users.entity';

export class ReceitasDTO {
  @ApiProperty({
    description: 'uuid do usuario',
  })
  @IsUUID('4')
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  user: Users;

  @ApiProperty({
    description: 'Descrição da despesa',
    minLength: CONSTRAINTS_LIMITS.DESCRICAO.min,
    maxLength: CONSTRAINTS_LIMITS.DESCRICAO.max,
  })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.DESCRICAO.min, CONSTRAINTS_LIMITS.DESCRICAO.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  descricao: string;

  @ApiProperty({ default: 0 })
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  valor: number;

  @ApiPropertyOptional({
    description: 'Data de vencimento',
    default: new Date(),
  })
  @IsDateString({}, { message: CONSTRAINTS_MESSAGES.IS_DATE })
  @IsOptional()
  pagamento: Date;

  @ApiPropertyOptional({ default: false })
  @IsBoolean({ message: CONSTRAINTS_MESSAGES.IS_BOOLEAN })
  @IsOptional()
  pago: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: CONSTRAINTS_MESSAGES.IS_NOT_EMPTY })
  // @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  carteira: Carteiras;
}
