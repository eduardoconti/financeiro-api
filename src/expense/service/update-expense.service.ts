import { Injectable, Inject } from '@nestjs/common';
import { DespesasDTO, ExpensePatchFlagPayedDTO } from 'src/expense/dto';
import { Despesas } from 'src/expense/entity';
import { ExpenseNotFoundException } from 'src/expense/exceptions';
import { IExpenseRepository } from 'src/expense/repository';

import { TYPES } from '@config/dependency-injection';

import { IUpdateExpenseService } from './update-expense.service.interface';

@Injectable()
export class UpdateExpenseService implements IUpdateExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private expenseRepository: IExpenseRepository,
  ) {}

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
    return await this.expenseRepository.update(id, despesa);
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
      await this.expenseRepository.update(id, patchData);
      expense.pago = patchData.pago;
    }
    return expense;
  }
}
