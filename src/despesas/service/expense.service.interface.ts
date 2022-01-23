import {
  DespesasDTO,
  ExpensePatchFlagPayedDTO,
  ExpensesGroupMonthDTO,
} from '@despesas/dto';
import { Despesas } from '@despesas/entity';
import { ExpenseDeletedResponse } from '@despesas/interface';

export interface IExpenseService {
  getOne(id: number, userId?: string): Promise<Despesas>;

  retornaTodasDespesas(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<Despesas[]>;

  retornaValorDespesasAgrupadosPorCategoria(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<any[]>;

  retornaValorDespesasAgrupadosPorCarteira(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<any[]>;

  retornaTotalDespesas(
    ano: number,
    mes: number,
    pago?: boolean,
    userId?: string,
  ): Promise<number>;

  retornaDespesasAgrupadasPorMes(
    ano?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<{ [k: string]: ExpensesGroupMonthDTO<Despesas> }>;

  insereDespesa(despesa: DespesasDTO): Promise<Despesas>;

  alteraDespesa(id: number, despesa: DespesasDTO): Promise<Despesas>;

  alteraFlagPago(
    id: number,
    patchData: ExpensePatchFlagPayedDTO,
  ): Promise<Despesas>;

  deletaDespesa(id: number): Promise<ExpenseDeletedResponse>;
}
