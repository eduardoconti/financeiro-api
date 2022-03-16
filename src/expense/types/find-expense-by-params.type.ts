import { Despesas } from 'src/expense/entity';
import { FindConditions, ObjectLiteral } from 'typeorm';

export type FindExpenseByParams =
  | FindConditions<Despesas>[]
  | (FindConditions<Despesas> & { user_id: string })
  | ObjectLiteral
  | string;
