import {
  GetEarningAmountGroupByWalletResponse,
  GetTotalEarningResponseDTO,
} from '@earning/dto';
import { Receitas } from '@earning/entity';
import { EarningGroupMonth, FindEarningByParams } from '@earning/types';

export interface IGetEarningService {
  getAllEarningsByUser(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<Receitas[]>;

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

  findOne(params: FindEarningByParams): Promise<Receitas>;

  getTotalEarnings(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<GetTotalEarningResponseDTO>;
}
