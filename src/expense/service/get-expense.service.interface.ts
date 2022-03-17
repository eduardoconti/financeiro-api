import {
  GetExpenseAmountGroupByCategoryResponse,
  GetExpenseAmountGroupByWalletResponse,
  GetTotalExpenseResponseDTO,
} from '@expense/dto';
import { Despesas } from '@expense/entity';
import { ExpenseGroupMonth, FindExpenseByParams } from '@expense/types';

export interface IGetExpenseService {
  getAllExpensesByUser(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<Despesas[]>;

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

  findOne(params: FindExpenseByParams): Promise<Despesas>;

  getTotalExpenses(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<GetTotalExpenseResponseDTO>;
}
