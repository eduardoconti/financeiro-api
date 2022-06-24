import { fakeUserId } from '@expense/mocks';

import { TransferenciasDTO } from '@transference/dto';
import { Transferencias } from '@transference/entity';

export const transferenceRequestMock = new TransferenciasDTO();
transferenceRequestMock.carteiraDestinoId = 1;
transferenceRequestMock.carteiraOrigemId = 1;
transferenceRequestMock.transferencia = new Date('2022-06-24');
transferenceRequestMock.pago = false;
transferenceRequestMock.valor = 500;

export const transferenceEntityMock = Transferencias.build({
  ...transferenceRequestMock,
  userId: fakeUserId,
});
