import { Inject } from '@nestjs/common';
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import {
  GetTotalTransferenceResponseDTO,
  GetTransferenceAmountGroupByWalletResponse,
  TransferenceGroupMonthDTO,
} from '@transference/dto';
import { Transferencias } from '@transference/entity';
import { TransferenceNotFoundException } from '@transference/exceptions';
import { ITransferenceRepository } from '@transference/repository';
import {
  FindTransferenceByParams,
  TransferenceGroupMonth,
} from '@transference/types';

import { DateHelper, SqlFileManager } from '@shared/helpers';

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
      this.buildParams(userId, pago, start, end),
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

    receitas.forEach((element) => {
      const { ...atributes } = element.data;
      monthTransferences[element.month] = TransferenceGroupMonthDTO.build({
        ...atributes,
      });
    });

    return monthTransferences;
  }

  async getTransferenceValuesGroupByWallet(
    type = 'origin',
    userId: string,
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
    return earnings.map((element) => {
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

  private buildDateWhere(
    start?: string,
    end?: string,
  ): FindOperator<Date> | undefined {
    if (!start && !end) {
      return;
    }
    if (start && end) {
      return Between(DateHelper.date(start), DateHelper.date(end));
    } else if (start) {
      return MoreThanOrEqual(DateHelper.date(start));
    } else if (end) {
      return LessThanOrEqual(DateHelper.date(end));
    } else {
      return;
    }
  }

  private buildParams(
    userId: string,
    pago?: boolean,
    start?: string,
    end?: string,
  ): FindTransferenceByParams {
    const params: FindTransferenceByParams = {};
    if (pago !== undefined) {
      params.pago = pago;
    }

    if (start || end) {
      params.transferencia = this.buildDateWhere(start, end);
    }

    params.userId = userId;

    return params;
  }
}
