import { CarteirasDeleteResponseDTO, CarteirasDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';

export interface IWalletRepository {
  insert(walletRequest: CarteirasDTO): Promise<Carteiras>;
  update(
    id: number,
    userId: string,
    walletRequest: CarteirasDTO,
  ): Promise<Carteiras>;
  findById(id: number): Promise<Carteiras>;
  find(userId: string): Promise<Carteiras[]>;
  delete(id: number, userId: string): Promise<CarteirasDeleteResponseDTO>;
}
