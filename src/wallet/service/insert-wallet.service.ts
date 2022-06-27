import { Injectable, Inject } from '@nestjs/common';

import { CarteirasDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';
import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { IInsertWalletService } from './insert-wallet.service.interface';

@Injectable()
export class InsertWalletService implements IInsertWalletService {
  constructor(
    @Inject(TYPES.WalletRepository)
    private walletRepository: IWalletRepository,
  ) {}

  async insertWallet(wallet: CarteirasDTO | Carteiras): Promise<Carteiras> {
    return await this.walletRepository.insert(wallet);
  }
}
