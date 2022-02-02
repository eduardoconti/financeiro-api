import {
  GetExpenseAmountGroupByCategoryResponse,
  GetExpenseAmountGroupByWalletResponse,
  GetTotalExpenseResponseDTO,
} from '@despesas/dto';
import { Despesas } from '@despesas/entity';
import { ExpenseGroupMonth, FindExpenseByParams } from '@despesas/types';

export interface IGetExpenseService {
  getAllExpensesByUser(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<Despesas[]>;

  getExpensesGroupByMonth(userId: string): Promise<ExpenseGroupMonth>;

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

  findOne(params: FindExpenseByParams): Promise<Despesas>;

  getTotalExpenses(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<GetTotalExpenseResponseDTO>;
}
