import { FindConditions, ObjectLiteral } from 'typeorm';

import { Despesas } from '@despesas/entity';

export type FindExpenseByParams =
  | FindConditions<Despesas>[]
  | (FindConditions<Despesas> & { user_id: string })
  | ObjectLiteral
  | string;
