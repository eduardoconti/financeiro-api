import { DespesasDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import { FindExpenseByParams } from '@expense/types';

import { DateHelper, OrmHelper } from '@shared/helpers';

export function calculateResidualPerInstalment(
  residual: number,
  instalments: number,
): { residualPerInstalment: number; instalmentsToReceivResidual: number } {
  {
    let instalmentsToReceivResidual = 1;
    let residualPerInstalment = residual;
    if (residual > 0.01) {
      do {
        instalmentsToReceivResidual++;
      } while (
        (residual * 100) % instalmentsToReceivResidual !== 0 &&
        instalmentsToReceivResidual <= instalments
      );
      residualPerInstalment =
        (residual * 100) / instalmentsToReceivResidual / 100;
    }

    return { residualPerInstalment, instalmentsToReceivResidual };
  }
}

export function calculateResidual(value: number, instalment: number): number {
  return ((value * 100) % instalment) / 100;
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
  const instalmentValue = valor / instalment;
  const residual = calculateResidual(valor, instalment);
  const { residualPerInstalment, instalmentsToReceivResidual } =
    calculateResidualPerInstalment(residual, instalment);
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
      valor: parseFloat(newValue.toFixed(2)),
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
