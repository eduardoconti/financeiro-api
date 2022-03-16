import { Receitas } from '@earning/entity';
import { FindConditions, ObjectLiteral } from 'typeorm';

export type FindEarningByParams =
  | FindConditions<Receitas>[]
  | (FindConditions<Receitas> & { user_id: string })
  | ObjectLiteral
  | string;
