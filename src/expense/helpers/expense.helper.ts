import { DespesasDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import { FindExpenseByParams } from '@expense/types';

import { DateHelper, OrmHelper } from '@shared/helpers';

export function calculateResidual(value: number, instalment: number): number {
  return value % instalment;
}

export function descriptionOfInstalment(
  instalment: number,
  instalments: number,
  description: string,
): string {
  return `${instalment}${'/'}${instalments}${' '}${description}`;
}

export function buildExpenseEntityInstalment(
  expense: DespesasDTO,
  userId: string,
  instalmentId: string,
): Despesas[] {
  const { valor, instalment, ...rest } = expense;
  let instalmentValue = valor / instalment;
  let instalmentsToReceivResidual = 0;
  let residualPerInstalment = 0;

  if (!Number.isInteger(instalmentValue)) {
    const residual = calculateResidual(valor, instalment);
    instalmentValue = Math.floor(instalmentValue);
    instalmentsToReceivResidual = residual;
    residualPerInstalment = 1;
  }

  const data: Despesas[] = [];
  for (let instalment = 1; instalment <= expense.instalment; instalment++) {
    const newValue =
      instalment <= instalmentsToReceivResidual
        ? instalmentValue + residualPerInstalment
        : instalmentValue;

    const entity = Despesas.build({
      ...rest,
      descricao: descriptionOfInstalment(
        instalment,
        expense.instalment,
        expense.descricao,
      ),
      valor: newValue,
      userId,
      instalment: instalment,
      vencimento: DateHelper.addMonth(instalment - 1, expense.vencimento),
      instalmentId,
      createdAt: DateHelper.dateNow(),
    });
    data.push(entity);
  }
  return data;
}

export function buildParams(
  userId: string,
  start?: string,
  end?: string,
  pago?: boolean,
): FindExpenseByParams {
  const params: FindExpenseByParams = {};
  if (pago !== undefined) {
    params.pago = pago;
  }

  if (start || end) {
    params.vencimento = OrmHelper.buildDateWhere(start, end);
  }

  params.userId = userId;
  return params;
}
