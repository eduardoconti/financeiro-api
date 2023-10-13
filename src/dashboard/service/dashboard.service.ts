import { Inject } from '@nestjs/common';

import { IGetEarningService } from '@earning/service';

import { TYPES } from '@config/dependency-injection';

import { IGetExpenseService } from '@expense/service';

import { DashBoardValues, GetDashBoardValuesParams } from '@dashboard/dto';

import { IDashBoardService } from './dashboard.service.interface';

export class DashBoardService implements IDashBoardService {
  constructor(
    @Inject(TYPES.GetExpenseService)
    private readonly getExpenseService: IGetExpenseService,
    @Inject(TYPES.GetEarningService)
    private readonly getEarningService: IGetEarningService,
  ) {}

  async getValues(
    userId: string,
    params: GetDashBoardValuesParams,
  ): Promise<DashBoardValues> {
    const [
      { totalPayed: earningsPayed, totalOpen: earningsOpen },
      { totalOpen: expensesOpen, totalPayed: expensesPayed },
      amount,
    ] = await Promise.all([
      this.getEarningService.getTotalEarnings(userId, params.start, params.end),
      this.getExpenseService.getTotalExpenses(userId, params.start, params.end),
      this.calculateAmount(userId),
    ]);

    return DashBoardValues.build({
      expensesOpen,
      expensesPayed,
      earningsPayed,
      earningsOpen,
      amount: amount,
      ballance: earningsPayed + earningsOpen - (expensesPayed + expensesOpen),
    });
  }

  private async calculateAmount(userId: string): Promise<number> {
    const [{ totalPayed: expenses }, { totalPayed: earnings }] =
      await Promise.all([
        this.getExpenseService.getTotalExpenses(userId),
        this.getEarningService.getTotalEarnings(userId),
      ]);

    return earnings - expenses;
  }
}
