import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { Carteiras } from '@wallet/entity';
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
    try {
      return await this.carteiraRepository.find(userId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
