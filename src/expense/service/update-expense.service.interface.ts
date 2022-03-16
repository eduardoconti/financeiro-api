import { DespesasDTO, ExpensePatchFlagPayedDTO } from 'src/expense/dto';
import { Despesas } from 'src/expense/entity';

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
