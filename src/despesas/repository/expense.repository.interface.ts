import { SelectQueryBuilder } from 'typeorm';

import { ExpenseDeleteResponseDTO } from '@despesas/dto';
import { Despesas } from '@despesas/entity';
import { FindExpenseByParams } from '@despesas/types';

export interface IExpenseRepository {
  queryBuilder(alias: string): SelectQueryBuilder<Despesas>;
  findOneByParams(params: FindExpenseByParams): Promise<Despesas | undefined>;
  findByParams(params: FindExpenseByParams): Promise<Despesas[]>;
  query(query: string, parameters?: any[]): Promise<any>;
  insert(expense: Despesas): Promise<Despesas>;
  delete(id: number): Promise<ExpenseDeleteResponseDTO>;
  update(id: number, expense: Partial<Despesas>): Promise<Despesas>;
}
