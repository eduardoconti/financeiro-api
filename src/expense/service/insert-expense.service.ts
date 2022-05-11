import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { TYPES } from '@config/dependency-injection';

import { DespesasDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import { InsertExpenseException } from '@expense/exceptions';
import { IExpenseRepository } from '@expense/repository';

import { DateHelper } from '@shared/helpers';

import { IInsertExpenseService } from './insert-expense.service.interface';

export class InsertExpenseService implements IInsertExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private readonly expenseRepository: IExpenseRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
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
    const data = [];
    const value = expense.valor / expense.instalment;
    const residual = expense.valor - value;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      for (let index = 1; index <= expense.instalment; index++) {
        const entity = Despesas.build({
          ...expense,
          descricao: `${index}${'/'}${expense.instalment}${' '}${
            expense.descricao
          }`,
          valor: index === 1 ? value + residual : value,
          userId,
          instalment: index,
          vencimento: DateHelper.addMonth(index - 1, expense.vencimento),
          instalmentId,
          createdAt: DateHelper.dateNow(),
        });

        data.push(entity);
        await queryRunner.manager.save(entity);
      }

      await queryRunner.commitTransaction();
      return data;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new InsertExpenseException(e);
    } finally {
      await queryRunner.release();
    }
  }
}
