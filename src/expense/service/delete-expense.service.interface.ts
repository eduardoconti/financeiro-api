import { ExpenseDeleteResponseDTO } from 'src/expense/dto';

export interface IDeleteExpenseService {
  delete(id: number, userId: string): Promise<ExpenseDeleteResponseDTO>;
}
