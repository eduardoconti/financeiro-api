import { Carteiras } from '@wallet/entity';

export interface IGetWalletService {
  getAllByUserId(userId: string): Promise<Carteiras[]>;
}
