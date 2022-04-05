import { FindOptionsWhere } from 'typeorm';

import { Transferencias } from '@transference/entity';

export type FindTransferenceByParams = FindOptionsWhere<Transferencias>;
