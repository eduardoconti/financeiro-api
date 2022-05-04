import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class HomeDTO {
  @ApiProperty({ type: 'string', example: 'financeiro' })
  public readonly api: string | undefined;
  @ApiProperty({ type: 'number', example: HttpStatus.OK })
  public readonly status: number | undefined;
  @ApiProperty({ type: 'string', example: '1.0.0' })
  public readonly version: string | undefined;

  constructor(api?: string, status?: number, version?: string) {
    this.api = api;
    this.status = status;
    this.version = version;
  }
}
