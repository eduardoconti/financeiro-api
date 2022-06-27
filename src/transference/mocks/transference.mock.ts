import { fakeUserId } from '@expense/mocks';

import {
  GetTotalTransferenceResponseDTO,
  GetTransferenceAmountGroupByWalletResponse,
  TransferenceGroupMonthDTO,
  TransferenciasDTO,
} from '@transference/dto';
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

export const transferenceGroupMonthDTOMock = TransferenceGroupMonthDTO.build({
  month: 1,
  total: 500,
  totalPayed: 0,
  totalOpen: 500,
  quantity: 1,
  data: [transferenceEntityMock],
});
export const getTransferencesGroupByMonthSqlMock = [
  {
    month: '202201',
    data: transferenceGroupMonthDTOMock,
  },
];

export const getTransferencesGroupByMonthResponseMock = {
  '202201': TransferenceGroupMonthDTO.build({
    ...getTransferencesGroupByMonthSqlMock[0].data,
  }),
};

export const getTransferenceValuesGroupByWalletMock = [
  GetTransferenceAmountGroupByWalletResponse.build({
    id: 1,
    valor: 500,
    descricao: 'Teste',
  }),
];

export const getTotalTransferencesSqlMock = [
  GetTotalTransferenceResponseDTO.build({
    total: 500,
    totalPayed: 0,
    totalOpen: 500,
  }),
];
