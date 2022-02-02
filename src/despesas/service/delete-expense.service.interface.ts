import { ExpenseDeleteResponseDTO } from '@despesas/dto';

export interface IDeleteExpenseService {
  delete(id: number, userId: string): Promise<ExpenseDeleteResponseDTO>;
}
