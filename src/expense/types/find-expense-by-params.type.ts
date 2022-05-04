import { FindOptionsWhere } from 'typeorm';

import { Despesas } from '@expense/entity';

export type FindExpenseByParams =
  | FindOptionsWhere<Despesas>
  | FindOptionsWhere<Despesas>[];
