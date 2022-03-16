import { Inject } from '@nestjs/common';
import { DespesasDTO } from 'src/expense/dto';
import { Despesas } from 'src/expense/entity';
import { IExpenseRepository } from 'src/expense/repository';

import { TYPES } from '@config/dependency-injection';

export class InsertExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private readonly expenseRepository: IExpenseRepository,
  ) {}

  async insert(expense: DespesasDTO, userId: string): Promise<Despesas> {
    const entity = Despesas.build({ ...expense, userId });

    return await this.expenseRepository.insert(entity);
  }
}
