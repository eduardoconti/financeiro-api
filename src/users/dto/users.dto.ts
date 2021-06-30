import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNumber, IsString, Length } from 'class-validator';
import { CONSTRAINTS_LIMITS, CONSTRAINTS_MESSAGES } from 'src/shared/constants';

export class UserDto {
  id: string;

  @ApiProperty({
    description: 'Login',
    minLength: CONSTRAINTS_LIMITS.LOGIN.min,
    maxLength: CONSTRAINTS_LIMITS.LOGIN.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.LOGIN.min, CONSTRAINTS_LIMITS.LOGIN.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  login: string;

  @ApiProperty({
    description: 'Login',
    minLength: CONSTRAINTS_LIMITS.PASSWORD.min,
    maxLength: CONSTRAINTS_LIMITS.PASSWORD.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.PASSWORD.min, CONSTRAINTS_LIMITS.PASSWORD.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  password: string;

  @ApiProperty({
    description: 'Nome',
    minLength: CONSTRAINTS_LIMITS.NOME.min,
    maxLength: CONSTRAINTS_LIMITS.NOME.max,
  })
  @IsString({ message: CONSTRAINTS_MESSAGES.IS_STRING })
  @Length(CONSTRAINTS_LIMITS.NOME.min, CONSTRAINTS_LIMITS.NOME.max, {
    message: CONSTRAINTS_MESSAGES.IS_LENGTH,
  })
  nome: string;

  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  status: number;

  @IsNumber({}, { message: CONSTRAINTS_MESSAGES.IS_NUMBER })
  perfil: number;

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
