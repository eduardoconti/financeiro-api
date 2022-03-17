import { SelectQueryBuilder } from 'typeorm';

import { ExpenseDeleteResponseDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import { FindExpenseByParams } from '@expense/types';

export interface IExpenseRepository {
  queryBuilder(alias: string): SelectQueryBuilder<Despesas>;
  findOneByParams(params: FindExpenseByParams): Promise<Despesas | undefined>;
  findByParams(params: FindExpenseByParams): Promise<Despesas[]>;
  query<D>(query: string, parameters?: any[]): Promise<D[]>;
  insert(expense: Despesas): Promise<Despesas>;
  delete(id: number): Promise<ExpenseDeleteResponseDTO>;
  update(id: number, expense: Partial<Despesas>): Promise<Despesas>;
}
