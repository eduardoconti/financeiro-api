import { Injectable, Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import {
  TransferencePatchFlagPayedDTO,
  TransferenciasDTO,
} from '@transference/dto';
import { Transferencias } from '@transference/entity';
import { TransferenceNotFoundException } from '@transference/exceptions';
import { ITransferenceRepository } from '@transference/repository';

import { IUpdateTransferenceService } from './update-transference.service.interface';

@Injectable()
export class UpdateTransferenceService implements IUpdateTransferenceService {
  constructor(
    @Inject(TYPES.TransferenceRepository)
    private transferenceRepository: ITransferenceRepository,
  ) {}

  async update(
    id: number,
    userId: string,
    despesa: Partial<TransferenciasDTO>,
  ): Promise<Transferencias> {
    const transference = await this.transferenceRepository.findOneByParams({
      id,
      userId,
    });
    if (!transference) {
      throw new TransferenceNotFoundException();
    }
    return await this.transferenceRepository.update(id, despesa);
  }

  async updateFlagPayed(
    id: number,
    userId: string,
    patchData: TransferencePatchFlagPayedDTO,
  ): Promise<Transferencias> {
    const transference = await this.transferenceRepository.findOneByParams({
      id,
      userId,
    });
    if (!transference) {
      throw new TransferenceNotFoundException();
    }
    if (transference.pago !== patchData.pago) {
      await this.transferenceRepository.update(id, {
        ...patchData,
        transferencia: patchData.pago ? new Date() : undefined,
      });
      transference.pago = patchData.pago;
    }

    const updated = await this.transferenceRepository.findOneByParams({ id });

    if (!updated) {
      throw new TransferenceNotFoundException();
    }
    return updated;
  }
}
