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
    return await this.expenseRepository.findByParams(
      this.buildParams(userId, start, end, pago),
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

    const despesas =
      await this.expenseRepository.query<GetExpenseAmountGroupByCategoryResponse>(
        sqlString,
        [userId, start, end, pago],
      );
    return despesas.map((element) => {
      return GetExpenseAmountGroupByCategoryResponse.build({ ...element });
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

    const [{ total, totalOpen, totalPayed }] =
      await this.expenseRepository.query<GetTotalExpenseResponseDTO>(
        sqlString,
        [userId, start, end],
      );

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

  private buildParams(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): FindExpenseByParams {
    const params: FindExpenseByParams = {};
    if (pago !== undefined) {
      params.pago = pago;
    }

    if (start || end) {
      params.vencimento = this.buildDateWhere(start, end);
    }

    params.userId = userId;
    return params;
  }
}
