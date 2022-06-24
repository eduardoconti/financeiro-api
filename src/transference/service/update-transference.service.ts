import { Injectable, Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import {
  TransferencePatchFlagPayedDTO,
  TransferenciasDTO,
} from '@transference/dto';
import { Transferencias } from '@transference/entity';
import { TransferenceNotFoundException } from '@transference/exceptions';
import { ITransferenceRepository } from '@transference/repository';

import { DateHelper } from '@shared/helpers';

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
    transference: Partial<TransferenciasDTO>,
  ): Promise<Transferencias> {
    const transferenceEntity =
      await this.transferenceRepository.findOneByParams({
        id,
        userId,
      });
    if (!transferenceEntity) {
      throw new TransferenceNotFoundException();
    }
    return await this.transferenceRepository.update(id, transference);
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
      return await this.transferenceRepository.update(id, {
        ...patchData,
        transferencia: patchData.pago
          ? DateHelper.dateNow()
          : transference.transferencia,
      });
    }
    return transference;
  }
}
