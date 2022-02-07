import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Despesas } from '@despesas/entity';
import {
  FindExpenseException,
  GetByQueryException,
} from '@despesas/exceptions';
import { FindExpenseByParams } from '@despesas/types';

import { IExpenseRepository } from './expense.repository.interface';

@Injectable()
export class ExpenseRepository implements IExpenseRepository {
  constructor(
    @InjectRepository(Despesas)
    private readonly repository: Repository<Despesas>,
  ) {}

  queryBuilder(alias: string): SelectQueryBuilder<Despesas> {
    return this.repository.createQueryBuilder(alias);
  }
  async findByParams(params: FindExpenseByParams): Promise<Despesas[]> {
    return await this.repository
      .find({
        relations: ['user', 'categoria', 'carteira'],
        where: params,
        order: { valor: 'DESC' },
      })
      .catch((e) => {
        throw new FindExpenseException(e);
      });
  }
  async query<T>(query: string, parameters?: string[] | undefined): Promise<T> {
    const result: T = await this.repository
      .query(query, parameters)
      .catch((e) => {
        throw new GetByQueryException(e);
      });

    return result;
  }
}
