import {
  GetExpenseAmountGroupByCategoryResponse,
  GetExpenseAmountGroupByWalletResponse,
  GetTotalExpenseResponseDTO,
} from '@despesas/dto';
import { Despesas } from '@despesas/entity';

export interface IGetExpenseService {
  getAllExpensesByUser(
    userId: string,
    ano?: number,
    mes?: number,
    pago?: boolean,
  ): Promise<Despesas[]>;

  getExpenseValuesGroupByWallet(
    userId: string,
    ano?: number,
    mes?: number,
    pago?: boolean,
  ): Promise<GetExpenseAmountGroupByWalletResponse[]>;

  getExpenseValuesGroupByCategory(
    userId: string,
    ano?: number,
    mes?: number,
    pago?: boolean,
  ): Promise<GetExpenseAmountGroupByCategoryResponse[]>;

  getTotalExpenses(
    userId: string,
    ano?: number,
    mes?: number,
  ): Promise<GetTotalExpenseResponseDTO>;
}
