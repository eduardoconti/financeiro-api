import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { IWalletRepository } from '@carteiras/repository';

import { TYPES } from '@config/dependency-injection';

import { Carteiras } from '../entity/carteiras.entity';
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
