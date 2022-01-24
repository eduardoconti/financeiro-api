import { CarteirasDeleteResponseDTO } from '@carteiras/dto';

export interface IDeleteWalletService {
  deleteWallet(id: number): Promise<CarteirasDeleteResponseDTO>;
}
