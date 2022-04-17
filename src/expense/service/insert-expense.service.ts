import { Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { DespesasDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import { IExpenseRepository } from '@expense/repository';

import { IInsertExpenseService } from './insert-expense.service.interface';
import { DateHelper } from '@shared/helpers';

export class InsertExpenseService implements IInsertExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private readonly expenseRepository: IExpenseRepository,
  ) { }

  async insert(expense: DespesasDTO, userId: string): Promise<Despesas> {

    const entity = Despesas.build({ ...expense, userId, createdAt: DateHelper.dateNow() });

    return await this.expenseRepository.insert(entity);
  }
}
