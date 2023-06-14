import { CarteirasDeleteResponseDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';

export interface IWalletRepository {
  insert(walletRequest: Carteiras): Promise<Carteiras>;
  update(walletEntity: Carteiras): Promise<Carteiras>;
  findById(id: number): Promise<Carteiras>;
  find(params: Partial<Carteiras>): Promise<Carteiras[]>;
  delete(id: number, userId: string): Promise<CarteirasDeleteResponseDTO>;
}
