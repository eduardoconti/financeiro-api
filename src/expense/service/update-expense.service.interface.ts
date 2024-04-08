import { DespesasDTO, ExpensePatchFlagPayedDTO } from '@expense/dto';
import { Despesa } from '@expense/entity';

export interface IUpdateExpenseService {
  update(
    id: number,
    userId: string,
    despesa: Partial<DespesasDTO>,
  ): Promise<Despesa>;

  updateFlagPayed(
    id: number,
    userId: string,
    patchData: ExpensePatchFlagPayedDTO,
  ): Promise<Despesa>;

  updateInstalment(
    userId: string,
    instalmentId: string,
    despesa: Partial<DespesasDTO>,
    id: number,
  ): Promise<Despesa>;
}
