import { Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import {
  GetTotalTransferenceResponseDTO,
  GetTransferenceAmountGroupByWalletResponse,
  TransferenceGroupMonthDTO,
} from '@transference/dto';
import { Transferencias } from '@transference/entity';
import { TransferenceNotFoundException } from '@transference/exceptions';
import { buildParams } from '@transference/helpers';
import { ITransferenceRepository } from '@transference/repository';
import {
  FindTransferenceByParams,
  TransferenceGroupMonth,
} from '@transference/types';

import { SqlFileManager } from '@shared/helpers';

import { IGetTransferenceService } from './get-transference.service.interface';

export class GetTransferenceService implements IGetTransferenceService {
  constructor(
    @Inject(TYPES.TransferenceRepository)
    private earningRepository: ITransferenceRepository,
  ) {}
  async getAllTransferencesByUser(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<Transferencias[]> {
    return await this.earningRepository.findByParams(
      buildParams(userId, start, end, pago),
    );
  }

  async getTransferencesGroupByMonth(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<TransferenceGroupMonth> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-transference-group-by-month.sql',
    );

    const receitas = await this.earningRepository.query<{
      month: string;
      data: TransferenceGroupMonthDTO;
    }>(sqlString, [userId, start, end]);

    const monthTransferences: TransferenceGroupMonth = {};

    receitas.forEach(element => {
      const { ...atributes } = element.data;
      monthTransferences[element.month] = TransferenceGroupMonthDTO.build({
        ...atributes,
      });
    });

    return monthTransferences;
  }

  async getTransferenceValuesGroupByWallet(
    userId: string,
    type = 'origin',
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<GetTransferenceAmountGroupByWalletResponse[]> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-transference-value-group-by-wallet-' + type + '.sql',
    );
    const earnings =
      await this.earningRepository.query<GetTransferenceAmountGroupByWalletResponse>(
        sqlString,
        [userId, start, end, pago],
      );
    return earnings.map(element => {
      return GetTransferenceAmountGroupByWalletResponse.build({ ...element });
    });
  }

  async getTotalTransferences(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<GetTotalTransferenceResponseDTO> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-transference-total-value.sql',
    );

    const [{ total, totalOpen, totalPayed }] =
      await this.earningRepository.query<GetTotalTransferenceResponseDTO>(
        sqlString,
        [userId, start, end],
      );

    return GetTotalTransferenceResponseDTO.build({
      total,
      totalOpen,
      totalPayed,
    });
  }

  async findOne(params: FindTransferenceByParams): Promise<Transferencias> {
    const transference = await this.earningRepository.findOneByParams(params);
    if (!transference) {
      throw new TransferenceNotFoundException();
    }
    return transference;
  }
}
