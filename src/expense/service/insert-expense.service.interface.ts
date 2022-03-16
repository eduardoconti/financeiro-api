import { DespesasDTO } from 'src/expense/dto';
import { Despesas } from 'src/expense/entity';

export interface IInsertExpenseService {
  insert(expense: DespesasDTO, userId: string): Promise<Despesas>;
}
