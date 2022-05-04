import { TransferenceDeleteResponseDTO } from '@transference/dto';
import { Transferencias } from '@transference/entity';
import { FindTransferenceByParams } from '@transference/types';

export interface ITransferenceRepository {
  findOneByParams(
    params: FindTransferenceByParams,
  ): Promise<Transferencias | null>;
  findByParams(params: FindTransferenceByParams): Promise<Transferencias[]>;
  query<D>(query: string, parameters?: any[]): Promise<D[]>;
  insert(expense: Transferencias): Promise<Transferencias>;
  delete(id: number): Promise<TransferenceDeleteResponseDTO>;
  update(id: number, expense: Partial<Transferencias>): Promise<Transferencias>;
}
