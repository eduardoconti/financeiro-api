import {
  FindExpenseByQueryParamsDTO,
  GetExpenseAmountGroupByCategoryResponse,
  GetExpenseAmountGroupByWalletResponse,
  GetTotalExpenseResponseDTO,
} from '@expense/dto';
import { Despesa } from '@expense/entity';
import { ExpenseGroupMonth, FindExpenseByParams } from '@expense/types';
export interface IGetExpenseService {
  getAllExpensesByUser(
    userId: string,
    params?: FindExpenseByQueryParamsDTO,
  ): Promise<Despesa[]>;

  getExpensesGroupByMonth(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<ExpenseGroupMonth>;

  getExpenseValuesGroupByWallet(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<GetExpenseAmountGroupByWalletResponse[]>;

  getExpenseValuesGroupByCategory(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<GetExpenseAmountGroupByCategoryResponse[]>;

  findOne(params: FindExpenseByParams): Promise<Despesa>;

  getTotalExpenses(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<GetTotalExpenseResponseDTO>;

  getUnplannedExpenses(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<ExpenseGroupMonth>;
}
