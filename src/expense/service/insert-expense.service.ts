import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { TYPES } from '@config/dependency-injection';

import { IDatabaseService } from '@db/services';

import { DespesasDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import { InsertExpenseException } from '@expense/exceptions';
import { buildExpenseEntityInstalment } from '@expense/helpers';
import { IExpenseRepository } from '@expense/repository';

import { DateHelper } from '@shared/helpers';

import { IInsertExpenseService } from './insert-expense.service.interface';

export class InsertExpenseService implements IInsertExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private readonly expenseRepository: IExpenseRepository,
    @Inject(TYPES.DatabaseService)
    private readonly databaseService: IDatabaseService,
  ) {}

  async insert(
    expense: DespesasDTO,
    userId: string,
  ): Promise<Despesas | Despesas[]> {
    if (expense.instalment === 1) {
      const entity = Despesas.build({
        ...expense,
        userId,
        createdAt: DateHelper.dateNow(),
      });

      return await this.expenseRepository.insert(entity);
    } else {
      return await this.insertInstalment(expense, userId);
    }
  }

  private async insertInstalment(
    expense: DespesasDTO,
    userId: string,
  ): Promise<Despesas[]> {
    const instalmentId = uuidv4();

    try {
      await this.databaseService.connect();
      await this.databaseService.startTransaction();
      const expenses = buildExpenseEntityInstalment(
        expense,
        userId,
        instalmentId,
      );
      expenses.forEach(async (element) => {
        await this.databaseService.save(element);
      });

      await this.databaseService.commitTransaction();
      return expenses;
    } catch (e) {
      console.log(e);
      await this.databaseService.rollbackTransaction();
      throw new InsertExpenseException(e);
    } finally {
      await this.databaseService.release();
    }
  }
}
