import { ApiProperty } from '@nestjs/swagger';
import { CONSTRAINTS_MESSAGES } from '@shared/constants';
import { IsString, Length } from 'class-validator';

import { UserDto } from '@users/dto';

export class LoginDTO {
  @IsString()
  @Length(6, 12, { message: CONSTRAINTS_MESSAGES.IS_LENGTH })
  @ApiProperty()
  password!: string;

  @IsString()
  @Length(6, 12, { message: CONSTRAINTS_MESSAGES.IS_LENGTH })
  @ApiProperty()
  username!: string;

  user?: UserDto;
}
