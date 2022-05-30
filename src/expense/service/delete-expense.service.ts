import { Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { IDatabaseService } from '@db/services';

import { ExpenseDeleteResponseDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import {
  DeleteExpenseException,
  ExpenseNotFoundException,
} from '@expense/exceptions';
import { IExpenseRepository } from '@expense/repository';

import { IDeleteExpenseService } from './delete-expense.service.interface';

export class DeleteExpenseService implements IDeleteExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private readonly expenseRepository: IExpenseRepository,
    @Inject(TYPES.DatabaseService)
    private readonly databaseService: IDatabaseService,
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
    const { instalmentId } = expense;

    if (!instalmentId) {
      return await this.expenseRepository.delete(id);
    } else {
      return await this.deleteInstalment(expense);
    }
  }

  private async deleteInstalment(
    expense: Despesas,
  ): Promise<ExpenseDeleteResponseDTO> {
    const { instalmentId, id, userId } = expense;
    try {
      await this.databaseService.connect();
      await this.databaseService.startTransaction();
      const expenses = await this.expenseRepository.findByParams({
        instalmentId,
      });
      expenses.forEach(async (element) => {
        await this.databaseService.delete(element);
      });
      await this.databaseService.commitTransaction();
      return new ExpenseDeleteResponseDTO();
    } catch (error) {
      await this.databaseService.rollbackTransaction();
      throw new DeleteExpenseException(error, { id, userId });
    } finally {
      await this.databaseService.release();
    }
  }
}
