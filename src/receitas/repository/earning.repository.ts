import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { EarningDeleteResponseDTO } from '@receitas/dto';
import { Receitas } from '@receitas/entity';
import {
  DeleteEarningException,
  FindEarningException,
  GetByQueryException,
  InsertEarningException,
  UpdateEarningException,
} from '@receitas/exceptions';
import { FindEarningByParams } from '@receitas/types';

import { IEarningRepository } from './earning.repository.interface';

@Injectable()
export class EarningRepository implements IEarningRepository {
  constructor(
    @InjectRepository(Receitas)
    private readonly repository: Repository<Receitas>,
  ) {}

  queryBuilder(alias: string): SelectQueryBuilder<Receitas> {
    return this.repository.createQueryBuilder(alias);
  }
  async findByParams(params: FindEarningByParams): Promise<Receitas[]> {
    return await this.repository
      .find({
        relations: ['carteira'],
        where: params,
        order: { pagamento: 'ASC' },
      })
      .catch((e) => {
        throw new FindEarningException(e);
      });
  }

  async findOneByParams(
    params: FindEarningByParams,
  ): Promise<Receitas | undefined> {
    return await this.repository
      .findOne({
        relations: ['carteira'],
        where: params,
      })
      .catch((e) => {
        throw new FindEarningException(e);
      });
  }
  async query(query: string, parameters?: any[]): Promise<any> {
    return await this.repository.query(query, parameters).catch((e) => {
      throw new GetByQueryException(e);
    });
  }

  async insert(expense: Receitas): Promise<Receitas> {
    const newEarning = await this.repository.create(expense);
    await this.repository.save(newEarning).catch((e) => {
      throw new InsertEarningException(e, expense);
    });
    return newEarning;
  }

  async delete(id: number): Promise<EarningDeleteResponseDTO> {
    await this.repository.delete({ id }).catch((e) => {
      throw new DeleteEarningException(e, id);
    });

    return new EarningDeleteResponseDTO();
  }

  async update(id: number, expense: Partial<Receitas>): Promise<Receitas> {
    await this.repository.update({ id }, expense).catch((e) => {
      throw new UpdateEarningException(e, expense);
    });
    const updated = this.repository
      .findOneOrFail({ where: { id: id } })
      .catch((e) => {
        throw new UpdateEarningException(e, expense);
      });
    return updated;
  }
}
