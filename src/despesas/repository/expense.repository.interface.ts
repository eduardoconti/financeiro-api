import { SelectQueryBuilder } from 'typeorm';

import { Despesas } from '@despesas/entity';
import { FindExpenseByParams } from '@despesas/types';

export interface IExpenseRepository {
  queryBuilder(alias: string): SelectQueryBuilder<Despesas>;
  findByParams(params: FindExpenseByParams): Promise<Despesas[]>;
  query(query: string, parameters?: any[]): Promise<any>;
}
