import { FindEarningByParams } from '@earning/types';

import { OrmHelper } from '@shared/helpers';

export function buildParams(
  userId: string,
  start?: string,
  end?: string,
  pago?: boolean,
): FindEarningByParams {
  const params: FindEarningByParams = {};
  if (pago !== undefined) {
    params.pago = pago;
  }

  if (start || end) {
    params.pagamento = OrmHelper.buildDateWhere(start, end);
  }

  params.userId = userId;
  return params;
}
