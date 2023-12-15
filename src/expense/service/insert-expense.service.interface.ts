import { DespesasDTO } from '@expense/dto';
import { Despesa } from '@expense/entity';

export interface IInsertExpenseService {
  insert(
    expense: DespesasDTO | Despesa,
    userId: string,
  ): Promise<Despesa | Despesa[]>;
}
