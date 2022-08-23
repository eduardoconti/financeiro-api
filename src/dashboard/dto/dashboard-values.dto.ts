import { ApiResponseProperty } from '@nestjs/swagger';

export class DashBoardValues {
  @ApiResponseProperty()
  expenses!: number;
  @ApiResponseProperty()
  earnings!: number;
  @ApiResponseProperty()
  amount!: number;
  @ApiResponseProperty()
  ballance!: number;

  constructor(dto: DashBoardValues) {
    Object.assign(this, dto);
  }

  static build(dto: DashBoardValues): DashBoardValues {
    return new DashBoardValues(dto);
  }
}
