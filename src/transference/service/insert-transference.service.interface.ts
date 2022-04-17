import { TransferenciasDTO } from '@transference/dto';
import { Transferencias } from '@transference/entity';

export interface IInsertTransferenceService {
  insert(expense: TransferenciasDTO, userId: string): Promise<Transferencias>;
}
