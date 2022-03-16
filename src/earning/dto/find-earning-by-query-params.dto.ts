import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindEarningByQueryParamsDTO {
  @ApiPropertyOptional({ example: '2022-02-10T03:00:00' })
  start?: string;
  @ApiPropertyOptional({ example: '2022-02-10T03:00:00' })
  end?: string;
  @ApiPropertyOptional()
  pago?: boolean;
}
