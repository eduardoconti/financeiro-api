import { FindOptionsWhere } from 'typeorm';

import { Earning } from '@earning/entity';

export type FindEarningByParams =
  | FindOptionsWhere<Earning>[]
  | FindOptionsWhere<Earning>;
