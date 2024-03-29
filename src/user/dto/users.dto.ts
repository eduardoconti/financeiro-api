import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

import { UserProfile, UserStatus } from '@users/enums';

import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from '@shared/constants';

export class UserDTO {
  id!: string;

  @ApiProperty({
    description: 'Login',
    minLength: CONSTRAINTS_LIMITS.LOGIN.min,
    maxLength: CONSTRAINTS_LIMITS.LOGIN.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.LOGIN.min, CONSTRAINTS_LIMITS.LOGIN.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  login!: string;

  @ApiProperty({
    description: 'Login',
    minLength: CONSTRAINTS_LIMITS.PASSWORD.min,
    maxLength: CONSTRAINTS_LIMITS.PASSWORD.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.PASSWORD.min, CONSTRAINTS_LIMITS.PASSWORD.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  password!: string;

  @ApiProperty({
    description: 'Name',
    minLength: CONSTRAINTS_LIMITS.NOME.min,
    maxLength: CONSTRAINTS_LIMITS.NOME.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.NOME.min, CONSTRAINTS_LIMITS.NOME.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({
    description: 'Status id',
    enum: UserStatus,
  })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  @IsEnum(UserStatus)
  status!: number;

  @ApiProperty({
    description: 'Profile id',
    enum: UserProfile,
  })
  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  @IsEnum(UserProfile)
  perfil!: number;

  /**
   *
   * @param password string
   */
  public setPassword(password: string): void {
    this.password = password;
  }

  /**
   *
   * @returns password string
   */
  public getPassword(): string | null {
    return this.password;
  }

  /**
   *
   * @param id string
   */
  public setId(id: string): void {
    this.id = id;
  }
}
