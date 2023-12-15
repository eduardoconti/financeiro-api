import { Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { TransferenceDeleteResponseDTO } from '@transference/dto';
import {
  DeleteTransferenceException,
  TransferenceNotFoundException,
} from '@transference/exceptions';
import { ITransferenceRepository } from '@transference/repository';

import { IDeleteTransferenceService } from './delete-transference.service.interface';

export class DeleteTransferenceService implements IDeleteTransferenceService {
  constructor(
    @Inject(TYPES.TransferenceRepository)
    private readonly transferenceRepository: ITransferenceRepository,
  ) {}

  async delete(
    id: number,
    userId: string,
  ): Promise<TransferenceDeleteResponseDTO> {
    const transference = await this.transferenceRepository
      .findOneByParams({ id, userId })
      .catch(e => {
        throw new DeleteTransferenceException(e, { id, userId });
      });

    if (!transference) {
      throw new TransferenceNotFoundException(undefined, { id, userId });
    }
    return await this.transferenceRepository.delete(id);
  }
}
