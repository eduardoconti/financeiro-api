import { TransferenceDeleteResponseDTO } from '@transference/dto';

export interface IDeleteTransferenceService {
  delete(id: number, userId: string): Promise<TransferenceDeleteResponseDTO>;
}
