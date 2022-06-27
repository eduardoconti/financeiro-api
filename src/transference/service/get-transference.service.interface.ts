import {
  GetTotalTransferenceResponseDTO,
  GetTransferenceAmountGroupByWalletResponse,
} from '@transference/dto';
import { Transferencias } from '@transference/entity';
import {
  FindTransferenceByParams,
  TransferenceGroupMonth,
} from '@transference/types';

export interface IGetTransferenceService {
  getAllTransferencesByUser(
    userId: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<Transferencias[]>;

  getTransferencesGroupByMonth(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<TransferenceGroupMonth>;

  getTransferenceValuesGroupByWallet(
    userId: string,
    type?: string,
    start?: string,
    end?: string,
    pago?: boolean,
  ): Promise<GetTransferenceAmountGroupByWalletResponse[]>;

  findOne(params: FindTransferenceByParams): Promise<Transferencias>;

  getTotalTransferences(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<GetTotalTransferenceResponseDTO>;
}
