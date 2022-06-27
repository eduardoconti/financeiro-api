import { CarteirasDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';

export interface IUpdateWalletService {
  updateWallet(
    id: number,
    userId: string,
    carteira: CarteirasDTO,
  ): Promise<Carteiras>;
}
