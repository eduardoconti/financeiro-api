import {
  TransferencePatchFlagPayedDTO,
  TransferenciasDTO,
} from '@transference/dto';
import { Transferencias } from '@transference/entity';

export interface IUpdateTransferenceService {
  update(
    id: number,
    userId: string,
    despesa: Partial<TransferenciasDTO>,
  ): Promise<Transferencias>;

  updateFlagPayed(
    id: number,
    userId: string,
    patchData: TransferencePatchFlagPayedDTO,
  ): Promise<Transferencias>;
}
