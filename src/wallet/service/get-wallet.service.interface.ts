import { Carteiras } from '@wallet/entity';

export interface IGetWalletService {
  getAllByUserId(userId: string): Promise<Carteiras[]>;
  findOne(id: number, userId: string): Promise<Carteiras>;
}
