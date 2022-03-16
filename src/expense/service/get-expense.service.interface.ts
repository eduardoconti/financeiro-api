import {
  GetExpenseAmountGroupByCategoryResponse,
  GetExpenseAmountGroupByWalletResponse,
  GetTotalExpenseResponseDTO,
} from 'src/expense/dto';
import { Despesas } from 'src/expense/entity';
import { ExpenseGroupMonth, FindExpenseByParams } from 'src/expense/types';

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
