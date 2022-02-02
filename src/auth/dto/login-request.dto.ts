import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDTO {
  @ApiProperty({ example: 'teste123' })
  username!: string;
  @ApiProperty({ example: 'Teste!123' })
  password!: string;
}
