import { Inject } from '@nestjs/common';
import {
  ExpensesGroupMonthDTO,
  GetExpenseAmountGroupByCategoryResponse,
  GetExpenseAmountGroupByWalletResponse,
  GetTotalExpenseResponseDTO,
} from 'src/expense/dto';
import { Despesas } from 'src/expense/entity';
import { ExpenseNotFoundException } from 'src/expense/exceptions';
import { IExpenseRepository } from 'src/expense/repository';
import { ExpenseGroupMonth, FindExpenseByParams } from 'src/expense/types';
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import { SqlFileManager } from '@shared/helpers';

import { IGetExpenseService } from './get-expense.service.interface';

export class GetExpenseService implements IGetExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private expenseRepository: IExpenseRepository,
  ) {}
  async getAllExpensesByUser(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<Despesas[]> {
    const params: FindExpenseByParams = {};
    if (pago !== undefined) {
      params.pago = pago;
    }

    if (start || end) {
      params.vencimento = this.buildDateWhere(start, end);
    }

    params.userId = userId;

    return await this.expenseRepository.findByParams({
      ...params,
    });
  }

  async getExpensesGroupByMonth(userId: string): Promise<ExpenseGroupMonth> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-expense-group-by-month.sql',
    );

    const despesas = await this.expenseRepository.query(sqlString, [userId]);

    const monthExpenses: ExpenseGroupMonth = {};

    despesas.forEach(
      (element: { month: string; data: ExpensesGroupMonthDTO }) => {
        const { ...atributes }: ExpensesGroupMonthDTO = element.data;
        monthExpenses[element.month] = ExpensesGroupMonthDTO.build({
          ...atributes,
        });
      },
    );

    return monthExpenses;
  }

  async getExpenseValuesGroupByWallet(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<any[]> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-expense-value-group-by-wallet.sql',
    );
    const despesas = await this.expenseRepository.query(sqlString, [
      userId,
      start,
      end,
      pago,
    ]);
    return despesas.map((element: GetExpenseAmountGroupByWalletResponse) => {
      const { valor, descricao, id }: GetExpenseAmountGroupByWalletResponse =
        element;
      return GetExpenseAmountGroupByWalletResponse.build({
        valor,
        descricao,
        id,
      });
    });
  }

  async getExpenseValuesGroupByCategory(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<GetExpenseAmountGroupByCategoryResponse[]> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-expense-value-group-by-category.sql',
    );

    const despesas = await this.expenseRepository.query(sqlString, [
      userId,
      start,
      end,
      pago,
    ]);
    return despesas.map((element: GetExpenseAmountGroupByCategoryResponse) => {
      const { valor, descricao, id }: GetExpenseAmountGroupByCategoryResponse =
        element;
      return GetExpenseAmountGroupByCategoryResponse.build({
        valor,
        descricao,
        id,
      });
    });
  }

  async getTotalExpenses(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<GetTotalExpenseResponseDTO> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-expense-total-value.sql',
    );

    const [{ total, totalopen: totalOpen, totalpayed: totalPayed }]: [
      { total: number; totalopen: number; totalpayed: number },
    ] = await this.expenseRepository.query(sqlString, [userId, start, end]);

    return GetTotalExpenseResponseDTO.build({
      total,
      totalOpen,
      totalPayed,
    });
  }

  async findOne(params: FindExpenseByParams): Promise<Despesas> {
    const expense = await this.expenseRepository.findOneByParams(params);
    if (!expense) {
      throw new ExpenseNotFoundException();
    }
    return expense;
  }

  private buildDateWhere(
    start?: string,
    end?: string,
  ): FindOperator<string> | undefined {
    if (!start && !end) {
      return;
    }
    if (start && end) {
      return Between(start, end);
    }
    if (start) {
      return MoreThanOrEqual(start);
    }
    if (end) {
      return LessThanOrEqual(end);
    }
  }
}
