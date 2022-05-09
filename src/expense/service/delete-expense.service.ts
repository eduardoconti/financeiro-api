import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

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
    @InjectDataSource() private readonly dataSource: DataSource,
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
    const queryRunner = this.dataSource.createQueryRunner();
    const { instalmentId, id, userId } = expense;
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const expenses = await this.expenseRepository.findByParams({
        instalmentId,
      });
      expenses.forEach(async (element) => {
        await queryRunner.manager.delete(Despesas, element.id);
      });
      await queryRunner.commitTransaction();
      return new ExpenseDeleteResponseDTO();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new DeleteExpenseException(error, { id, userId });
    } finally {
      await queryRunner.release();
    }
  }
}
