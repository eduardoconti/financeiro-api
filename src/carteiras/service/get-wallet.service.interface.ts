import { Carteiras } from '@carteiras/entity';

export interface IGetWalletService {
  getAllByUserId(userId: string): Promise<Carteiras[]>;
}
