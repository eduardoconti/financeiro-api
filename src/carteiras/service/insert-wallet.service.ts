import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { CarteirasDTO } from '@carteiras/dto';
import { Carteiras } from '@carteiras/entity';
import { IWalletRepository } from '@carteiras/repository';

import { TYPES } from '@config/dependency-injection';

import { IInsertWalletService } from './insert-wallet.service.interface';

@Injectable()
export class InsertWalletService implements IInsertWalletService {
  constructor(
    @Inject(TYPES.WalletRepository)
    private walletRepository: IWalletRepository,
  ) {}

  async insertWallet(wallet: CarteirasDTO): Promise<Carteiras> {
    try {
      return await this.walletRepository.insert(wallet);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
