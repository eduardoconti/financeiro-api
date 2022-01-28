import { CarteirasDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';

export interface IInsertWalletService {
  insertWallet(wallet: CarteirasDTO): Promise<Carteiras>;
}
