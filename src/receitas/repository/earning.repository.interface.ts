import { SelectQueryBuilder } from 'typeorm';

import { EarningDeleteResponseDTO } from '@receitas/dto';
import { Receitas } from '@receitas/entity';
import { FindEarningByParams } from '@receitas/types';

export interface IEarningRepository {
  queryBuilder(alias: string): SelectQueryBuilder<Receitas>;
  findOneByParams(params: FindEarningByParams): Promise<Receitas | undefined>;
  findByParams(params: FindEarningByParams): Promise<Receitas[]>;
  query<D>(query: string, parameters?: any[]): Promise<D[]>;
  insert(expense: Receitas): Promise<Receitas>;
  delete(id: number): Promise<EarningDeleteResponseDTO>;
  update(id: number, expense: Partial<Receitas>): Promise<Receitas>;
}
