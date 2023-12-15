import { DespesasDTO, FindExpenseByQueryParamsDTO } from '@expense/dto';
import { Despesa } from '@expense/entity';
import { DateType } from '@expense/enums';
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
): Despesa[] {
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

  const data: Despesa[] = [];
  for (let instalment = 1; instalment <= expense.instalment; instalment++) {
    const newValue =
      instalment <= instalmentsToReceivResidual
        ? instalmentValue + residualPerInstalment
        : instalmentValue;

    const entity = Despesa.build({
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
  queryParams: FindExpenseByQueryParamsDTO,
): FindExpenseByParams {
  const {
    start,
    end,
    pago,
    categoryId,
    walletId,
    dateField = DateType.DUEDATE,
  } = queryParams;
  const params: FindExpenseByParams = {};

  if (pago !== undefined) {
    params.pago = pago;
  }

  if (categoryId) {
    params.categoriaId = categoryId;
  }

  if (walletId) {
    params.carteiraId = walletId;
  }

  if (start || end) {
    if (dateField === DateType.DUEDATE) {
      params.vencimento = OrmHelper.buildDateWhere(start, end);
    }
    if (dateField === DateType.CREATEDAT) {
      params.createdAt = OrmHelper.buildDateWhere(start, end);
    }
    if (dateField === DateType.PAYMENTDATE) {
      params.pagamento = OrmHelper.buildDateWhere(start, end);
    }
    if (dateField === DateType.UPDATEDAT) {
      params.updatedAt = OrmHelper.buildDateWhere(start, end);
    }
    if (dateField === DateType.UNPLANNED) {
      params.vencimento = OrmHelper.buildDateWhere(start, end);
      params.createdAt = OrmHelper.buildDateWhere(start, end);
    }
  }

  return { ...params, userId };
}
