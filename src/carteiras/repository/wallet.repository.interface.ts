import { CarteirasDeleteResponseDTO, CarteirasDTO } from '@carteiras/dto';
import { Carteiras } from '@carteiras/entity';

export interface IWalletRepository {
  insert(walletRequest: CarteirasDTO): Promise<Carteiras>;
  update(id: number, walletRequest: CarteirasDTO): Promise<Carteiras>;
  findById(id: number): Promise<Carteiras>;
  find(userId: string): Promise<Carteiras[]>;
  delete(id: number): Promise<CarteirasDeleteResponseDTO>;
}
