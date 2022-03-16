import { ExpenseDeleteResponseDTO } from 'src/expense/dto';
import { Despesas } from 'src/expense/entity';
import { FindExpenseByParams } from 'src/expense/types';
import { SelectQueryBuilder } from 'typeorm';

export interface IExpenseRepository {
  queryBuilder(alias: string): SelectQueryBuilder<Despesas>;
  findOneByParams(params: FindExpenseByParams): Promise<Despesas | undefined>;
  findByParams(params: FindExpenseByParams): Promise<Despesas[]>;
  query(query: string, parameters?: any[]): Promise<any>;
  insert(expense: Despesas): Promise<Despesas>;
  delete(id: number): Promise<ExpenseDeleteResponseDTO>;
  update(id: number, expense: Partial<Despesas>): Promise<Despesas>;
}
