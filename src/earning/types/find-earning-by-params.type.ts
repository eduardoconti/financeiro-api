import { FindConditions, ObjectLiteral } from 'typeorm';

import { Receitas } from '@earning/entity';

export type FindEarningByParams =
  | FindConditions<Receitas>[]
  | (FindConditions<Receitas> & { user_id: string })
  | ObjectLiteral
  | string;
