import { CarteirasDeleteResponseDTO, CarteirasDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';

import { fakeUserId } from '@expense/mocks';
export const mockWalletRequest = CarteirasDTO.build({
  descricao: 'Carteira Teste',
});

export const mockWalletEntity = Carteiras.build({
  ...mockWalletRequest,
  userId: fakeUserId,
  id: 9999,
});

export const mockWalletDeleteResponse = new CarteirasDeleteResponseDTO(true);
