import {
  EarningsGroupMonthDTO,
  GetEarningAmountGroupByWalletResponse,
  GetTotalEarningResponseDTO,
  ReceitasDTO,
} from '@earning/dto';
import { Earning } from '@earning/entity';

export const mockEarningRequest = ReceitasDTO.build({
  descricao: 'Teste',
  valor: 500,
  carteiraId: 1,
  pago: false,
});

export const mockEarningEntity = Earning.build({
  ...mockEarningRequest,
  userId: 'fakeid',
  createdAt: new Date('2022-05-26T18:59:18.026Z'),
});
export const earningsGroupMonthDTOMock = EarningsGroupMonthDTO.build({
  month: 1,
  total: 500,
  totalPayed: 0,
  totalOpen: 500,
  quantity: 1,
  data: [mockEarningEntity],
});

export const getEarningsGroupByMonthSqlMock: {
  month: string;
  data: EarningsGroupMonthDTO;
}[] = [
  {
    month: '202201',
    data: earningsGroupMonthDTOMock,
  },
  {
    month: '202202',
    data: { ...earningsGroupMonthDTOMock, month: 2 },
  },
  {
    month: '202203',
    data: { ...earningsGroupMonthDTOMock, month: 3 },
  },
];

export const getEarningValuesGroupByWalletSqlMock: GetEarningAmountGroupByWalletResponse[] =
  [
    GetEarningAmountGroupByWalletResponse.build({
      id: 1,
      valor: 500,
      descricao: 'Teste',
    }),
  ];

export const getEarningsGroupByMonthResponseMock = {
  '202201': EarningsGroupMonthDTO.build({
    ...getEarningsGroupByMonthSqlMock[0].data,
  }),
  '202202': EarningsGroupMonthDTO.build({
    ...getEarningsGroupByMonthSqlMock[1].data,
  }),
  '202203': EarningsGroupMonthDTO.build({
    ...getEarningsGroupByMonthSqlMock[2].data,
  }),
};

export const getTotalEarningsSqlMock: GetTotalEarningResponseDTO[] = [
  GetTotalEarningResponseDTO.build({
    total: 500,
    totalOpen: 500,
    totalPayed: 0,
  }),
];
