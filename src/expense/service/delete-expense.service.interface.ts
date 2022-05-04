import { ExpenseDeleteResponseDTO } from '@expense/dto';

export interface IDeleteExpenseService {
  delete(id: number, userId: string): Promise<ExpenseDeleteResponseDTO>;
}
