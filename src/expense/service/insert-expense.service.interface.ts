import { DespesasDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';

export interface IInsertExpenseService {
  insert(
    expense: DespesasDTO | Despesas,
    userId: string,
  ): Promise<Despesas | Despesas[]>;
}
