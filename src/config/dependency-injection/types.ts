import { TYPES as AUTH_TYPES } from '@auth/config/dependency-injection';

import { TYPES as EARNING_TYPES } from '@earning/config/dependency-injection';

import { TYPES as CATEGORIA_TYPES } from '@category/config/dependency-injection';

import { TYPES as CARTEIRA_TYPES } from '@wallet/config/dependency-injection';

import { TYPES as APP_TYPES } from '@app/config/dependency-injection';

import { TYPES as USER_TYPES } from '@users/config/dependency-injection';

import { TYPES as DATABASE_TYPES } from '@db/config/dependency-injection';

import { TYPES as EXPENSE_TYPES } from '@expense/config/dependency-injection';

import { TYPES as GRAPHIC_TYPES } from '@graphic/config/dependency-injection';

import { TYPES as TRANSFERENCE_TYPES } from '@transference/config/dependency-injection';

import { TYPES as DASHBOARD_TYPES } from '@dashboard/config/dependency-injection';

export const TYPES: { [keys: string]: symbol } = {
  ...USER_TYPES,
  ...APP_TYPES,
  ...AUTH_TYPES,
  ...CARTEIRA_TYPES,
  ...CATEGORIA_TYPES,
  ...EXPENSE_TYPES,
  ...GRAPHIC_TYPES,
  ...EARNING_TYPES,
  ...TRANSFERENCE_TYPES,
  ...DATABASE_TYPES,
  ...DASHBOARD_TYPES,
};
