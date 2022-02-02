import { DespesasDTO, ExpensePatchFlagPayedDTO } from '@despesas/dto';
import { Despesas } from '@despesas/entity';

export interface IUpdateExpenseService {
  update(
    id: number,
    userId: string,
    despesa: Partial<DespesasDTO>,
  ): Promise<Despesas>;

  updateFlagPayed(
    id: number,
    userId: string,
    patchData: ExpensePatchFlagPayedDTO,
  ): Promise<Despesas>;
}
