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

  async insertWallet({ descricao, userId }: CarteirasDTO): Promise<Carteiras> {
    const walletEntity = new Carteiras({
      active: true,
      descricao: descricao,
      userId: userId,
    });
    return await this.walletRepository.insert(walletEntity);
  }
}
