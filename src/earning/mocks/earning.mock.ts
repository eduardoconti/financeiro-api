import { ReceitasDTO } from '@earning/dto';
import { Earning } from '@earning/entity';

export const mockEarningRequest = ReceitasDTO.build({
  descricao: 'Teste',
  valor: 50,
  carteiraId: 1,
  pago: false,
});

export const mockEarningEntity = Earning.build({
  ...mockEarningRequest,
  userId: 'fakeid',
  createdAt: new Date('2022-05-26T18:59:18.026Z'),
});
