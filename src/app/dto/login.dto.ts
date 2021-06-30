import { ApiProperty } from '@nestjs/swagger';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { IsString, Length } from 'class-validator';
import { CONSTRAINTS_MESSAGES } from 'src/shared/constants';
import { UserDto } from 'src/users/dto/users.dto';
import { Users } from 'src/users/entity/users.entity';

export class LoginDTO {
  @IsString()
  @Length(6, 12, { message: CONSTRAINTS_MESSAGES.IS_LENGTH })
  @ApiProperty()
  password: string;

  @IsString()
  @Length(6, 12, { message: CONSTRAINTS_MESSAGES.IS_LENGTH })
  @ApiProperty()
  username: string;

  user?: UserDto;
}
