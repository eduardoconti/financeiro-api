import { Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { ExpenseDeleteResponseDTO } from '@despesas/dto';
import {
  DeleteExpenseException,
  ExpenseNotFoundException,
} from '@despesas/exceptions';
import { IExpenseRepository } from '@despesas/repository';

import { IDeleteExpenseService } from './delete-expense.service.interface';

export class DeleteExpenseService implements IDeleteExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private readonly expenseRepository: IExpenseRepository,
  ) {}

  async delete(id: number, userId: string): Promise<ExpenseDeleteResponseDTO> {
    const expense = await this.expenseRepository
      .findOneByParams({ id, userId })
      .catch((e) => {
        throw new DeleteExpenseException(e, { id, userId });
      });

    if (!expense) {
      throw new ExpenseNotFoundException(undefined, { id, userId });
    }
    return await this.expenseRepository.delete(id);
  }
}
