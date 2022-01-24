import { CarteirasDTO } from '@carteiras/dto';
import { Carteiras } from '@carteiras/entity';

export interface IInsertWalletService {
  insertWallet(wallet: CarteirasDTO): Promise<Carteiras>;
}
