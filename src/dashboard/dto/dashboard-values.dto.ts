import { ApiResponseProperty } from '@nestjs/swagger';

export class DashBoardValues {
  @ApiResponseProperty()
  expensesOpen!: number;
  @ApiResponseProperty()
  expensesPayed!: number;
  @ApiResponseProperty()
  earningsOpen!: number;
  @ApiResponseProperty()
  earningsPayed!: number;
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
