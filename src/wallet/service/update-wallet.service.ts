import { Injectable, Inject } from '@nestjs/common';

import { CarteirasDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';
import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { IUpdateWalletService } from './update-wallet.service.interface';

@Injectable()
export class UpdateWalletService implements IUpdateWalletService {
  constructor(
    @Inject(TYPES.WalletRepository)
    private walletRepository: IWalletRepository,
  ) {}

  async updateWallet(
    id: number,
    userId: string,
    wallet: CarteirasDTO,
  ): Promise<Carteiras> {
    return await this.walletRepository.update(id, userId, wallet);
  }
}
