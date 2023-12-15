import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';

import { ExpenseDeleteResponseDTO } from '@expense/dto';
import { Despesa } from '@expense/entity';
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
    @InjectRepository(Despesa)
    private readonly repository: Repository<Despesa>,
  ) {}

  queryBuilder(alias: string): SelectQueryBuilder<Despesa> {
    return this.repository.createQueryBuilder(alias);
  }

  async findByParams(params: FindExpenseByParams): Promise<Despesa[]> {
    return await this.repository
      .find({
        relations: ['categoria', 'carteira', 'subCategory'],
        where: params,
        order: { valor: 'DESC' },
        select: {
          createdAt: false,
          carteiraId: false,
          categoriaId: false,
          subCategoryId: false,
          userId: false,
          categoria: { id: true, descricao: true },
          subCategory: { id: true, description: true, categoryId: true },
          carteira: { active: false, id: true, descricao: true },
        },
      })
      .catch(e => {
        throw new FindExpenseException(e);
      });
  }

  async findOneByParams(params: FindExpenseByParams): Promise<Despesa | null> {
    const result = await this.repository
      .find({
        relations: ['categoria', 'carteira', 'subCategory'],
        where: params,
        order: { valor: 'DESC' }, 
        select: {
          createdAt: false,
          carteiraId: false,
          categoriaId: false,
          subCategoryId: false,
          userId: false,
          categoria: { id: true, descricao: true },
          subCategory: { id: true, description: true, categoryId: true },
          carteira: { active: false, id: true, descricao: true },
        },
      })
      .catch(e => {
        throw new FindExpenseException(e);
      });

    return result[0];
  }

  async query(query: string, parameters?: any[]): Promise<any> {
    return await this.repository.query(query, parameters).catch(e => {
      throw new GetByQueryException(e);
    });
  }

  async insert(expense: Despesa): Promise<Despesa> {
    try {
      const newExpense = await this.repository.create(expense);
      await this.repository.save(newExpense);

      const result = (await this.findOneByParams({
        id: newExpense.id,
      })) as Despesa;

      return result;
    } catch (e) {
      throw new InsertExpenseException(e, expense);
    }
  }

  async insertMany(expense: Despesa[]): Promise<Despesa[]> {
    try {
      return await this.repository.save(expense);
    } catch (e) {
      throw new InsertExpenseException(e, expense);
    }
  }

  async delete(id: number): Promise<ExpenseDeleteResponseDTO> {
    await this.repository.delete({ id }).catch(e => {
      throw new DeleteExpenseException(e, id);
    });

    return new ExpenseDeleteResponseDTO();
  }

  async deleteMany(id: number[]): Promise<ExpenseDeleteResponseDTO> {
    await this.repository.delete({ id: In(id) }).catch(e => {
      throw new DeleteExpenseException(e, id);
    });

    return new ExpenseDeleteResponseDTO();
  }

  async update(id: number, expense: Partial<Despesa>): Promise<Despesa> {
    await this.repository.update({ id }, expense).catch(e => {
      throw new UpdateExpenseException(undefined, e, expense);
    });
    const updated = await this.findOneByParams({ id: id })as Despesa;
    return updated;
  }
}
