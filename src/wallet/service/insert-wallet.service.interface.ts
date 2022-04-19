import { Carteiras } from '@wallet/entity';

export interface IInsertWalletService {
  insertWallet(wallet: Carteiras): Promise<Carteiras>;
}
