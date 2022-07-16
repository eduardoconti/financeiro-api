import { ApiPropertyOptional } from '@nestjs/swagger';

import { DateType } from '@expense/enums';

export class FindExpenseByQueryParamsDTO {
  @ApiPropertyOptional({ example: '2022-02-10T03:00:00' })
  start?: string;
  @ApiPropertyOptional({ example: '2022-02-10T03:00:00' })
  end?: string;
  @ApiPropertyOptional()
  pago?: boolean;
  @ApiPropertyOptional()
  dateField?: DateType;
  @ApiPropertyOptional()
  categoryId?: number;
  @ApiPropertyOptional()
  walletId?: number;
}
