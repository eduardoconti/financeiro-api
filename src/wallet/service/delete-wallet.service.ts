import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { CarteirasDeleteResponseDTO } from '@wallet/dto';
import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { IDeleteWalletService } from './delete-wallet.service.interface';

@Injectable()
export class DeleteWalletService implements IDeleteWalletService {
  constructor(
    @Inject(TYPES.WalletRepository)
    private walletRepository: IWalletRepository,
  ) {}

  async deleteWallet(
    id: number,
    userId: string,
  ): Promise<CarteirasDeleteResponseDTO> {
    return await this.walletRepository.delete(id, userId);
  }
}
