import { Inject } from '@nestjs/common';

import { IGetEarningService } from '@earning/service';

import { TYPES } from '@config/dependency-injection';

import { IGetExpenseService } from '@expense/service';

import { IGetTransferenceService } from '@transference/service';

import { DashBoardValues, GetDashBoardValuesParams } from '@dashboard/dto';

import { IDashBoardService } from './dashboard.service.interface';

export class DashBoardService implements IDashBoardService {
  constructor(
    @Inject(TYPES.GetExpenseService)
    private readonly getExpenseService: IGetExpenseService,
    @Inject(TYPES.GetEarningService)
    private readonly getEarningService: IGetEarningService,
    @Inject(TYPES.GetTransferenceService)
    private readonly getTransferenceService: IGetTransferenceService,
  ) {}

  async getValues(
    userId: string,
    params: GetDashBoardValuesParams,
  ): Promise<DashBoardValues> {
    const { totalPayed: earningsPayed, totalOpen: earningsOpen } =
      await this.getEarningService.getTotalEarnings(
        userId,
        params.start,
        params.end,
      );

    const { totalOpen: expensesOpen, totalPayed: expensesPayed } =
      await this.getExpenseService.getTotalExpenses(
        userId,
        params.start,
        params.end,
      );
    return DashBoardValues.build({
      expensesOpen,
      expensesPayed,
      earningsPayed,
      earningsOpen,
      amount: await this.calculateAmount(userId),
      ballance: earningsPayed + earningsOpen - (expensesPayed + expensesOpen),
    });
  }

  private async calculateAmount(userId: string): Promise<number> {
    const { totalPayed: expenses } =
      await this.getExpenseService.getTotalExpenses(userId);
    const { totalPayed: earnings } =
      await this.getEarningService.getTotalEarnings(userId);

    return earnings - expenses;
  }
}
