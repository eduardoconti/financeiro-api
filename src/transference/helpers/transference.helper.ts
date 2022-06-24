import { FindTransferenceByParams } from '@transference/types';

import { OrmHelper } from '@shared/helpers';

export function buildParams(
  userId: string,
  start?: string,
  end?: string,
  pago?: boolean,
): FindTransferenceByParams {
  const params: FindTransferenceByParams = {};
  if (pago !== undefined) {
    params.pago = pago;
  }

  if (start || end) {
    params.transferencia = OrmHelper.buildDateWhere(start, end);
  }

  params.userId = userId;
  return params;
}
