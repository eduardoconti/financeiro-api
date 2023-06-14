import { Carteiras } from '@wallet/entity';

export type UpdateWalletServiceInput = {
  id: number;
  userId: string;
  description?: string;
  active?: boolean;
};
export interface IUpdateWalletService {
  updateWallet(input: UpdateWalletServiceInput): Promise<Carteiras>;
}
