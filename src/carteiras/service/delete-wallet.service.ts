import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { CarteirasDeleteResponseDTO } from '@carteiras/dto';
import { IWalletRepository } from '@carteiras/repository';

import { TYPES } from '@config/dependency-injection';

import { IDeleteWalletService } from './delete-wallet.service.interface';

@Injectable()
export class DeleteWalletService implements IDeleteWalletService {
  constructor(
    @Inject(TYPES.WalletRepository)
    private walletRepository: IWalletRepository,
  ) {}

  async deleteWallet(id: number): Promise<CarteirasDeleteResponseDTO> {
    try {
      return await this.walletRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
