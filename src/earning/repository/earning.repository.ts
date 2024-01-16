import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { EarningDeleteResponseDTO } from '@earning/dto';
import { Earning } from '@earning/entity';
import {
  DeleteEarningException,
  FindEarningException,
  GetByQueryException,
  InsertEarningException,
  UpdateEarningException,
} from '@earning/exceptions';
import { FindEarningByParams } from '@earning/types';

import { IEarningRepository } from './earning.repository.interface';

@Injectable()
export class EarningRepository implements IEarningRepository {
  constructor(
    @InjectRepository(Earning)
    private readonly repository: Repository<Earning>,
  ) {}

  queryBuilder(alias: string): SelectQueryBuilder<Earning> {
    return this.repository.createQueryBuilder(alias);
  }
  async findByParams(params: FindEarningByParams): Promise<Earning[]> {
    return await this.repository
      .find({
        relations: ['carteira'],
        where: params,
        order: { valor: 'DESC' },
        select: {
          userId: false,
          createdAt: false,
          updatedAt: false,
          carteiraId: false,
          carteira: { id: true, active: false, descricao: true },
        },
      })
      .catch(e => {
        throw new FindEarningException(e);
      });
  }

  async findOneByParams(params: FindEarningByParams): Promise<Earning | null> {
    const result = await this.repository
      .find({
        relations: ['carteira'],
        where: params,
        select: {
          userId: false,
          createdAt: false,
          updatedAt: false,
          carteiraId: false,
          carteira: { id: true, active: false },
        },
      })
      .catch(e => {
        throw new FindEarningException(e);
      });

    if (!result || !result.length) {
      throw new UpdateEarningException();
    }

    return result[0];
  }

  async query(query: string, parameters?: any[]): Promise<any> {
    return await this.repository.query(query, parameters).catch(e => {
      throw new GetByQueryException(e);
    });
  }

  async insert(expense: Earning): Promise<Earning> {
    const newEarning = await this.repository.create(expense);
    await this.repository.save(newEarning).catch(e => {
      throw new InsertEarningException(e, expense);
    });
    return await this.repository
      .findOneOrFail({ where: { id: newEarning.id }, relations: ['carteira'] })
      .catch(e => {
        throw new InsertEarningException(e, expense);
      });
  }

  async delete(id: number): Promise<EarningDeleteResponseDTO> {
    await this.repository.delete({ id }).catch(e => {
      throw new DeleteEarningException(e, id);
    });

    return new EarningDeleteResponseDTO();
  }

  async update(id: number, expense: Partial<Earning>): Promise<Earning> {
    await this.repository.update({ id }, expense).catch(e => {
      throw new UpdateEarningException(e, expense);
    });
    const updated = await this.repository
      .find({
        where: { id: id },
        relations: ['carteira'],
        select: {
          userId: false,
          createdAt: false,
          updatedAt: false,
          carteiraId: false,
          carteira: { id: true, active: false },
        },
      })
      .catch(e => {
        throw new UpdateEarningException(e, expense);
      });

    if (!updated || !updated.length) {
      throw new UpdateEarningException();
    }
    return updated[0];
  }
}
