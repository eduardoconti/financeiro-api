import {
  CarteirasDeleteResponseDTO,
  CarteirasDTO,
  UpdateWalletRequest,
} from '@wallet/dto';
import { Carteiras } from '@wallet/entity';
import { UpdateWalletServiceInput } from '@wallet/service';

import { fakeUserId } from '@expense/mocks';
export const mockWalletRequest = CarteirasDTO.build({
  descricao: 'Carteira Teste',
});

export const mockUpdateWalletRequest: UpdateWalletRequest = {
  description: 'Carteira',
  active: false,
};

export const mockWalletEntity = Carteiras.build({
  ...mockWalletRequest,
  userId: fakeUserId,
  id: 9999,
  active: true,
});

export const mockWalletUpdateInput: UpdateWalletServiceInput = {
  id: 1,
  userId: fakeUserId,
  active: true,
  description: 'Carteira',
};

export const mockWalletDeleteResponse = new CarteirasDeleteResponseDTO(true);
