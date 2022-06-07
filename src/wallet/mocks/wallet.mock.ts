import { CarteirasDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';
const fakeUserId = 'ba783aa3-3067-4829-8a6b-ce73fca6b06d';
export const mockWalletRequest = CarteirasDTO.build({
  descricao: 'Carteira Teste',
  userId: fakeUserId,
});

export const mockWalletEntity = Carteiras.build({
  ...mockWalletRequest,
  id: 9999,
});
