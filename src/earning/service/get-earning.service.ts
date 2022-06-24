import { Inject } from '@nestjs/common';

import {
  EarningsGroupMonthDTO,
  GetEarningAmountGroupByWalletResponse,
  GetTotalEarningResponseDTO,
} from '@earning/dto';
import { Earning } from '@earning/entity';
import { EarningNotFoundException } from '@earning/exceptions';
import { buildParams } from '@earning/helpers';
import { IEarningRepository } from '@earning/repository';
import { EarningGroupMonth, FindEarningByParams } from '@earning/types';

import { TYPES } from '@config/dependency-injection';

import { SqlFileManager } from '@shared/helpers';

import { IGetEarningService } from './get-earning.service.interface';
export class GetEarningService implements IGetEarningService {
  constructor(
    @Inject(TYPES.EarningRepository)
    private earningRepository: IEarningRepository,
  ) {}
  async getAllEarningsByUser(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<Earning[]> {
    return await this.earningRepository.findByParams(
      buildParams(userId, start, end, pago),
    );
  }

  async getEarningsGroupByMonth(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<EarningGroupMonth> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-earning-group-by-month.sql',
    );

    const receitas = await this.earningRepository.query<{
      month: string;
      data: EarningsGroupMonthDTO;
    }>(sqlString, [userId, start, end]);

    const monthEarnings: EarningGroupMonth = {};

    receitas.forEach((element) => {
      const { ...atributes } = element.data;
      monthEarnings[element.month] = EarningsGroupMonthDTO.build({
        ...atributes,
      });
    });

    return monthEarnings;
  }

  async getEarningValuesGroupByWallet(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<GetEarningAmountGroupByWalletResponse[]> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-earning-value-group-by-wallet.sql',
    );
    const earnings =
      await this.earningRepository.query<GetEarningAmountGroupByWalletResponse>(
        sqlString,
        [userId, start, end, pago],
      );
    return earnings.map((element) => {
      return GetEarningAmountGroupByWalletResponse.build({ ...element });
    });
  }

  async getTotalEarnings(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<GetTotalEarningResponseDTO> {
    const sqlString = SqlFileManager.readFile(
      __dirname,
      'get-earning-total-value.sql',
    );

    const [{ total, totalOpen, totalPayed }] =
      await this.earningRepository.query<GetTotalEarningResponseDTO>(
        sqlString,
        [userId, start, end],
      );

    return GetTotalEarningResponseDTO.build({
      total,
      totalOpen,
      totalPayed,
    });
  }

  async findOne(params: FindEarningByParams): Promise<Earning> {
    const earning = await this.earningRepository.findOneByParams(params);
    if (!earning) {
      throw new EarningNotFoundException();
    }
    return earning;
  }
}
