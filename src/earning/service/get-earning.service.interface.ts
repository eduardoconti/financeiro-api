import {
  GetEarningAmountGroupByWalletResponse,
  GetTotalEarningResponseDTO,
} from '@earning/dto';
import { Earning } from '@earning/entity';
import { EarningGroupMonth, FindEarningByParams } from '@earning/types';

export interface IGetEarningService {
  getAllEarningsByUser(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<Earning[]>;

  getEarningsGroupByMonth(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<EarningGroupMonth>;

  getEarningValuesGroupByWallet(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<GetEarningAmountGroupByWalletResponse[]>;

  findOne(params: FindEarningByParams): Promise<Earning>;

  getTotalEarnings(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<GetTotalEarningResponseDTO>;
}
