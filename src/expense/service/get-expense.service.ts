import { Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import {
  ExpensesGroupMonthDTO,
  FindExpenseByQueryParamsDTO,
  GetExpenseAmountGroupByCategoryResponse,
  GetExpenseAmountGroupByWalletResponse,
  GetTotalExpenseResponseDTO,
} from '@expense/dto';
import { Despesas } from '@expense/entity';
import { ExpenseNotFoundException } from '@expense/exceptions';
import { buildParams } from '@expense/helpers';
import { IExpenseRepository } from '@expense/repository';
import { ExpenseGroupMonth, FindExpenseByParams } from '@expense/types';

import { SqlFileManager } from '@shared/helpers';

import { IGetExpenseService } from './get-expense.service.interface';

export class GetExpenseService implements IGetExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private expenseRepository: IExpenseRepository,
  ) {}
  async getAllExpensesByUser(
    userId: string,
    params: FindExpenseByQueryParamsDTO,
  ): Promise<Despesas[]> {
    return await this.expenseRepository.findByParams(
      buildParams(userId, params),
    );
  }

  async getExpensesGroupByMonth(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<ExpenseGroupMonth> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-expense-group-by-month.sql',
    );

    const despesas = await this.expenseRepository.query<{
      month: string;
      data: ExpensesGroupMonthDTO;
    }>(sqlString, [userId, start, end]);

    const monthExpenses: ExpenseGroupMonth = {};

    despesas.forEach((element) => {
      const { ...atributes }: ExpensesGroupMonthDTO = element.data;
      monthExpenses[element.month] = ExpensesGroupMonthDTO.build({
        ...atributes,
      });
    });

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
    const despesas =
      await this.expenseRepository.query<GetExpenseAmountGroupByWalletResponse>(
        sqlString,
        [userId, start, end, pago],
      );
    return despesas.map((element) => {
      return GetExpenseAmountGroupByWalletResponse.build(element);
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
      'get-expense-value-group-by-category-and-subcategory.sql',
    );

    const despesas =
      await this.expenseRepository.query<GetExpenseAmountGroupByCategoryResponse>(
        sqlString,
        [userId, start, end, pago],
      );
    return despesas.map((element) => {
      return GetExpenseAmountGroupByCategoryResponse.build(element);
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

    const [{ ...data }] =
      await this.expenseRepository.query<GetTotalExpenseResponseDTO>(
        sqlString,
        [userId, start, end],
      );

    return GetTotalExpenseResponseDTO.build(data);
  }

  async findOne(params: FindExpenseByParams): Promise<Despesas> {
    const expense = await this.expenseRepository.findOneByParams(params);
    if (!expense) {
      throw new ExpenseNotFoundException();
    }
    return expense;
  }

  async getUnplannedExpenses(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<ExpenseGroupMonth> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-unplanned-expenses.sql',
    );

    const despesas = await this.expenseRepository.query<ExpensesGroupMonthDTO>(
      sqlString,
      [userId, start, end],
    );

    if (!despesas) {
      throw new ExpenseNotFoundException();
    }
    const monthExpenses: ExpenseGroupMonth = {};

    despesas.forEach((element: ExpensesGroupMonthDTO) => {
      monthExpenses[element.month] = ExpensesGroupMonthDTO.build({
        ...element,
      });
    });

    return monthExpenses;
  }
}
