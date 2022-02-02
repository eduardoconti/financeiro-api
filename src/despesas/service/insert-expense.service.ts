import { Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { DespesasDTO } from '@despesas/dto';
import { Despesas } from '@despesas/entity';
import { IExpenseRepository } from '@despesas/repository';

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
