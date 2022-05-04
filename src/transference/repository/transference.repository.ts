import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransferenceDeleteResponseDTO } from '@transference/dto';
import { Transferencias } from '@transference/entity';
import {
  DeleteTransferenceException,
  FindTransferenceException,
  GetByQueryException,
  InsertTransferenceException,
  UpdateTransferenceException,
} from '@transference/exceptions';
import { FindTransferenceByParams } from '@transference/types';

import { ITransferenceRepository } from './transference.repository.interface';

@Injectable()
export class TransferenceRepository implements ITransferenceRepository {
  constructor(
    @InjectRepository(Transferencias)
    private readonly repository: Repository<Transferencias>,
  ) {}

  async findByParams(
    params: FindTransferenceByParams,
  ): Promise<Transferencias[]> {
    return await this.repository
      .find({
        relations: ['user', 'carteiraOrigem', 'carteiraDestino'],
        where: params,
        order: { valor: 'DESC' },
      })
      .catch((e) => {
        throw new FindTransferenceException(e);
      });
  }

  async findOneByParams(
    params: FindTransferenceByParams,
  ): Promise<Transferencias | null> {
    return await this.repository
      .findOne({
        relations: ['user', 'carteiraOrigem', 'carteiraDestino'],
        where: params,
        order: { valor: 'DESC' },
      })
      .catch((e) => {
        throw new FindTransferenceException(e);
      });
  }
  async query(query: string, parameters?: any[]): Promise<any> {
    return await this.repository.query(query, parameters).catch((e) => {
      throw new GetByQueryException(e);
    });
  }

  async insert(expense: Transferencias): Promise<Transferencias> {
    try {
      const newTransference = await this.repository.create(expense);
      await this.repository.save(newTransference);
      return newTransference;
    } catch (e) {
      throw new InsertTransferenceException(e, expense);
    }
  }

  async delete(id: number): Promise<TransferenceDeleteResponseDTO> {
    await this.repository.delete({ id }).catch((e) => {
      throw new DeleteTransferenceException(e, id);
    });

    return new TransferenceDeleteResponseDTO();
  }

  async update(
    id: number,
    expense: Partial<Transferencias>,
  ): Promise<Transferencias> {
    await this.repository.update({ id }, expense).catch((e) => {
      throw new UpdateTransferenceException(e, expense);
    });
    const updated = this.repository
      .findOneOrFail({ where: { id: id } })
      .catch((e) => {
        throw new UpdateTransferenceException(e, expense);
      });
    return updated;
  }
}
