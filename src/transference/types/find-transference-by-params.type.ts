import { FindConditions, ObjectLiteral } from 'typeorm';

import { Transferencias } from '@transference/entity';

export type FindTransferenceByParams =
  | FindConditions<Transferencias>[]
  | (FindConditions<Transferencias> & { user_id: string })
  | ObjectLiteral
  | string;
