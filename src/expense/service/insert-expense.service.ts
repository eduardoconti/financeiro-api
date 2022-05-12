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
    const { valor, instalment, ...rest } = expense;
    const instalmentId = uuidv4();
    const instalmentValue = valor / instalment;
    const residual = this.calculateResidual(valor, instalment);
    const { residualPerInstalment, instalmentsToReceivResidual } =
      this.calculateResidualPerInstalment(residual, instalment);
    const data: Despesas[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      for (let instalment = 1; instalment <= expense.instalment; instalment++) {
        const entity = Despesas.build({
          ...rest,
          descricao: `${instalment}${'/'}${expense.instalment}${' '}${
            expense.descricao
          }`,
          valor:
            instalment <= instalmentsToReceivResidual
              ? instalmentValue + residualPerInstalment
              : instalmentValue,
          userId,
          instalment: instalment,
          vencimento: DateHelper.addMonth(instalment - 1, expense.vencimento),
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

  private calculateResidual(value: number, instalment: number): number {
    return ((value * 100) % instalment) / 100;
  }

  private calculateResidualPerInstalment(
    residual: number,
    instalments: number,
  ): { residualPerInstalment: number; instalmentsToReceivResidual: number } {
    let instalmentsToReceivResidual = 1;
    let residualPerInstalment = residual;
    if (residual > 0.01) {
      do {
        instalmentsToReceivResidual++;
      } while (
        (residual * 100) % instalmentsToReceivResidual !== 0 &&
        instalmentsToReceivResidual <= instalments
      );
      residualPerInstalment =
        (residual * 100) / instalmentsToReceivResidual / 100;
    }

    return { residualPerInstalment, instalmentsToReceivResidual };
  }
}
