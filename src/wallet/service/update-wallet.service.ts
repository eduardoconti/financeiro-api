import { Injectable, Inject } from '@nestjs/common';

import { Carteiras } from '@wallet/entity';
import { ForbiddenWalletException } from '@wallet/exception';
import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import {
  IUpdateWalletService,
  UpdateWalletServiceInput,
} from './update-wallet.service.interface';

@Injectable()
export class UpdateWalletService implements IUpdateWalletService {
  constructor(
    @Inject(TYPES.WalletRepository)
    private walletRepository: IWalletRepository,
  ) {}

  async updateWallet({
    id,
    userId,
    description,
    active,
  }: UpdateWalletServiceInput): Promise<Carteiras> {
    const entity = await this.walletRepository.findById(id);

    if (entity.userId !== userId) {
      throw new ForbiddenWalletException();
    }

    if (description) {
      entity.descricao = description;
    }

    if (typeof active !== 'undefined' && active !== entity.active) {
      entity.active = active;
    }

    return await this.walletRepository.update(entity);
  }
}
