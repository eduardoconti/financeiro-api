import { SelectQueryBuilder } from 'typeorm';

import { ExpenseDeleteResponseDTO } from '@expense/dto';
import { Despesa } from '@expense/entity';
import { FindExpenseByParams } from '@expense/types';

export interface IExpenseRepository {
  queryBuilder(alias: string): SelectQueryBuilder<Despesa>;
  findOneByParams(params: FindExpenseByParams): Promise<Despesa | null>;
  findByParams(params: FindExpenseByParams): Promise<Despesa[]>;
  query<D>(query: string, parameters?: any[]): Promise<D[]>;
  insert(expense: Despesa): Promise<Despesa>;
  insertMany(expense: Despesa[]): Promise<Despesa[]>;
  delete(id: number): Promise<ExpenseDeleteResponseDTO>;
  update(id: number, expense: Partial<Despesa>): Promise<Despesa>;
  deleteMany(id: number[]): Promise<ExpenseDeleteResponseDTO>;
}
