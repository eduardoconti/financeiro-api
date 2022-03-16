import { FindConditions, ObjectLiteral } from 'typeorm';

import { Earning } from '@earning/entity';

export type FindEarningByParams =
  | FindConditions<Earning>[]
  | (FindConditions<Earning> & { user_id: string })
  | ObjectLiteral
  | string;
