import { SelectQueryBuilder } from 'typeorm';

import { EarningDeleteResponseDTO } from '@earning/dto';
import { Earning } from '@earning/entity';
import { FindEarningByParams } from '@earning/types';

export interface IEarningRepository {
  queryBuilder(alias: string): SelectQueryBuilder<Earning>;
  findOneByParams(params: FindEarningByParams): Promise<Earning | undefined>;
  findByParams(params: FindEarningByParams): Promise<Earning[]>;
  query<D>(query: string, parameters?: any[]): Promise<D[]>;
  insert(expense: Earning): Promise<Earning>;
  delete(id: number): Promise<EarningDeleteResponseDTO>;
  update(id: number, expense: Partial<Earning>): Promise<Earning>;
}
