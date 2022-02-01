import { Inject } from '@nestjs/common';
import { Between } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import {
  GetExpenseAmountGroupByCategoryResponse,
  GetExpenseAmountGroupByWalletResponse,
  GetTotalExpenseResponseDTO,
} from '@despesas/dto';
import { Despesas } from '@despesas/entity';
import { IExpenseRepository } from '@despesas/repository';
import { FindExpenseByParams } from '@despesas/types';

import { SqlFileManager } from '@shared/helpers';

import { IGetExpenseService } from './get-expense.service.interface';

export class GetExpenseService implements IGetExpenseService {
  constructor(
    @Inject(TYPES.Repo)
    private expenseRepository: IExpenseRepository,
  ) {}
  async getAllExpensesByUser(
    userId: string,
    ano?: number,
    mes?: number,
    pago?: boolean,
  ): Promise<Despesas[]> {
    const params: FindExpenseByParams = {};
    if (pago !== undefined) {
      params.pago = pago;
    }
    if (typeof ano === 'string') {
      ano = parseInt(ano);
    }
    if (typeof mes === 'string') {
      mes = parseInt(mes) - 1;
    }

    params.vencimento = this.buildDateWhere(ano, mes);

    params.userId = userId;
    console.log(params.vencimento);
    return await this.expenseRepository.findByParams({
      ...params,
    });
  }

  async getExpenseValuesGroupByWallet(
    userId: string,
    ano?: number,
    mes?: number,
    pago?: boolean,
  ): Promise<any[]> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-expense-value-group-by-wallet.sql',
    );
    const despesas = await this.expenseRepository.query(sqlString, [
      userId,
      ano,
      mes,
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
    ano?: number,
    mes?: number,
    pago?: boolean,
  ): Promise<GetExpenseAmountGroupByCategoryResponse[]> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-expense-value-group-by-category.sql',
    );

    const despesas = await this.expenseRepository.query(sqlString, [
      userId,
      ano,
      mes,
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
    ano?: number,
    mes?: number,
  ): Promise<GetTotalExpenseResponseDTO> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-expense-total-value.sql',
    );

    const [{ total, totalopen: totalOpen, totalpayed: totalPayed }]: [
      { total: number; totalopen: number; totalpayed: number },
    ] = await this.expenseRepository.query(sqlString, [userId, ano, mes]);

    return GetTotalExpenseResponseDTO.build({
      total,
      totalOpen,
      totalPayed,
    });
  }

  private buildDateWhere(ano?: number, mes?: number) {
    if (ano !== undefined) {
      const initialDate = this.buildInitialDate(ano, mes);
      const finalDate = this.buildFinalDate(ano, mes);
      return Between(initialDate, finalDate);
    }
  }

  private buildInitialDate(ano: number, mes?: number): Date {
    return new Date(ano, mes ?? 0, 1, -3, 0, 0);
  }

  private buildFinalDate(ano: number, mes?: number): Date {
    return new Date(ano, (mes ?? 11) + 1, 0, 20, 59, 59);
  }
}
