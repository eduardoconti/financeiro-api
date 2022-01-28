import { Injectable, Inject, BadRequestException } from '@nestjs/common';

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

  async updateWallet(id: number, wallet: CarteirasDTO): Promise<Carteiras> {
    try {
      return await this.walletRepository.update(id, wallet);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
