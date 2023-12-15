import { FindOptionsWhere } from 'typeorm';

import { Despesa } from '@expense/entity';

export type FindExpenseByParams =
  | FindOptionsWhere<Despesa>
  | FindOptionsWhere<Despesa>[];
