import { DespesasDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';

export interface IInsertExpenseService {
  insert(expense: DespesasDTO, userId: string): Promise<Despesas | Despesas[]>;
}
