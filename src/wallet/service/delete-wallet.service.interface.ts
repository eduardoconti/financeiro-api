import { CarteirasDeleteResponseDTO } from '@wallet/dto';

export interface IDeleteWalletService {
  deleteWallet(id: number): Promise<CarteirasDeleteResponseDTO>;
}
