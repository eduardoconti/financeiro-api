import { DespesasDTO, ExpensePatchFlagPayedDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';

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
