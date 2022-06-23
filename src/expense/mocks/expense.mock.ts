import { DespesasDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import { descriptionOfInstalment } from '@expense/helpers';

import { DateHelper } from '@shared/helpers';

export const createdAt = new Date('2022-05-26T18:59:18.026Z');
export const nextMonth = DateHelper.addMonth(1, createdAt);
export const fakeUserId = '6fdeff33-a45d-4e51-b6f0-b7e695f72089';
export const fakeInsertExpenseRequest = DespesasDTO.build({
  descricao: 'Teste',
  valor: 100,
  carteiraId: 1,
  categoriaId: 1,
  instalment: 1,
  vencimento: createdAt,
  pago: false,
});

export const fakeInsertExpenseRequestWithInstalment: DespesasDTO = {
  ...fakeInsertExpenseRequest,
  instalment: 2,
};

export const mockExpenseEntity = Despesas.build({
  ...fakeInsertExpenseRequest,
  id: 1,
  userId: fakeUserId,
  createdAt,
  valor: 100,
});
export const mockExpenseInstalment = Despesas.build({
  ...fakeInsertExpenseRequestWithInstalment,
  createdAt,
  valor: 500,
  id: 1,
  userId: fakeUserId,
  descricao: descriptionOfInstalment(2, 2, fakeInsertExpenseRequest.descricao),
  vencimento: nextMonth,
  instalmentId: 'fakeid',
});
