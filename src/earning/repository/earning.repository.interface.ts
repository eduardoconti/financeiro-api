import { EarningDeleteResponseDTO } from '@earning/dto';
import { Receitas } from '@earning/entity';
import { FindEarningByParams } from '@earning/types';
import { SelectQueryBuilder } from 'typeorm';

export interface IEarningRepository {
  queryBuilder(alias: string): SelectQueryBuilder<Receitas>;
  findOneByParams(params: FindEarningByParams): Promise<Receitas | undefined>;
  findByParams(params: FindEarningByParams): Promise<Receitas[]>;
  query<D>(query: string, parameters?: any[]): Promise<D[]>;
  insert(expense: Receitas): Promise<Receitas>;
  delete(id: number): Promise<EarningDeleteResponseDTO>;
  update(id: number, expense: Partial<Receitas>): Promise<Receitas>;
}
