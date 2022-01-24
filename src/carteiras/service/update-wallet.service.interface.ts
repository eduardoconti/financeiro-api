import { CarteirasDTO } from '@carteiras/dto';
import { Carteiras } from '@carteiras/entity';

export interface IUpdateWalletService {
  updateWallet(id: number, carteira: CarteirasDTO): Promise<Carteiras>;
}
