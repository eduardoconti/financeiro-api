import { DespesasDTO } from '@despesas/dto';
import { Despesas } from '@despesas/entity';

export interface IInsertExpenseService {
  insert(expense: DespesasDTO, userId: string): Promise<Despesas>;
}
