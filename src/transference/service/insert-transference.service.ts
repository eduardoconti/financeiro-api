import { Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { TransferenciasDTO } from '@transference/dto';
import { Transferencias } from '@transference/entity';
import { ITransferenceRepository } from '@transference/repository';

import { IInsertTransferenceService } from './insert-transference.service.interface';

export class InsertTransferenceService implements IInsertTransferenceService {
  constructor(
    @Inject(TYPES.TransferenceRepository)
    private readonly transferenceRepository: ITransferenceRepository,
  ) {}

  async insert(
    transference: TransferenciasDTO,
    userId: string,
  ): Promise<Transferencias> {
    const entity = Transferencias.build({ ...transference, userId });

    return await this.transferenceRepository.insert(entity);
  }
}
