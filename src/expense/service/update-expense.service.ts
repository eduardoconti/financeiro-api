import { Injectable, Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { DespesasDTO, ExpensePatchFlagPayedDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import { ExpenseNotFoundException } from '@expense/exceptions';
import { IExpenseRepository } from '@expense/repository';

import { IUpdateExpenseService } from './update-expense.service.interface';
import { DateHelper } from '@shared/helpers';

@Injectable()
export class UpdateExpenseService implements IUpdateExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private expenseRepository: IExpenseRepository,
  ) { }

  async update(
    id: number,
    userId: string,
    despesa: Partial<DespesasDTO>,
  ): Promise<Despesas> {
    const expense = await this.expenseRepository.findOneByParams({
      id,
      userId,
    });
    if (!expense) {
      throw new ExpenseNotFoundException();
    }

    return await this.expenseRepository.update(id, { ...despesa, updatedAt: DateHelper.dateNow() });
  }

  async updateFlagPayed(
    id: number,
    userId: string,
    patchData: ExpensePatchFlagPayedDTO,
  ): Promise<Despesas> {
    const expense = await this.expenseRepository.findOneByParams({
      id,
      userId,
    });
    if (!expense) {
      throw new ExpenseNotFoundException();
    }
    if (expense.pago !== patchData.pago) {
      await this.expenseRepository.update(id, {
        ...patchData,
        pagamento: patchData.pago ? DateHelper.dateNow() : undefined,
      });
      expense.pago = patchData.pago;
    }

    const updated = await this.expenseRepository.findOneByParams({ id });

    if (!updated) {
      throw new ExpenseNotFoundException();
    }
    return updated;
  }
}
