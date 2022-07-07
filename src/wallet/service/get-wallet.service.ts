import { Injectable, Inject } from '@nestjs/common';

import { Carteiras } from '@wallet/entity';
import { ForbiddenWalletException } from '@wallet/exception';
import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { IGetWalletService } from './get-wallet.service.interface';

@Injectable()
export class GetWalletService implements IGetWalletService {
  constructor(
    @Inject(TYPES.WalletRepository)
    private carteiraRepository: IWalletRepository,
  ) {}

  async getAllByUserId(userId: string): Promise<Carteiras[]> {
    return await this.carteiraRepository.find(userId);
  }

  async findOne(id: number, userId: string): Promise<Carteiras> {
    const wallet = await this.carteiraRepository.findById(id);
    if (wallet.userId !== userId) {
      throw new ForbiddenWalletException();
    }
    return wallet;
  }
}
