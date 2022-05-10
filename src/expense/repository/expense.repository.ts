import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { ExpenseDeleteResponseDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import {
  DeleteExpenseException,
  FindExpenseException,
  GetByQueryException,
  InsertExpenseException,
  UpdateExpenseException,
} from '@expense/exceptions';
import { FindExpenseByParams } from '@expense/types';

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

  async findOneByParams(params: FindExpenseByParams): Promise<Despesas | null> {
    return await this.repository
      .findOne({
        relations: ['user', 'categoria', 'carteira'],
        where: params,
        order: { valor: 'DESC' },
      })
      .catch((e) => {
        throw new FindExpenseException(e);
      });
  }
  async query(query: string, parameters?: any[]): Promise<any> {
    return await this.repository.query(query, parameters).catch((e) => {
      throw new GetByQueryException(e);
    });
  }

  async insert(expense: Despesas): Promise<Despesas> {
    try {
      const newExpense = await this.repository.create(expense);
      await this.repository.save(newExpense);
      return newExpense;
    } catch (e) {
      throw new InsertExpenseException(e, expense);
    }
  }

  async delete(id: number): Promise<ExpenseDeleteResponseDTO> {
    await this.repository.delete({ id }).catch((e) => {
      throw new DeleteExpenseException(e, id);
    });

    return new ExpenseDeleteResponseDTO();
  }

  async update(id: number, expense: Partial<Despesas>): Promise<Despesas> {
    await this.repository.update({ id }, expense).catch((e) => {
      throw new UpdateExpenseException(undefined, e, expense);
    });
    const updated = await this.repository
      .findOneOrFail({ where: { id: id } })
      .catch((e) => {
        throw new UpdateExpenseException(undefined, e, expense);
      });
    return updated;
  }
}
