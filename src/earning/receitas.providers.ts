import { Connection } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import { Earning } from './entity/earning.entity';

export const ReceitasProviders = [
  {
    provide: TYPES.EarningRepository,
    useFactory: (connection: Connection) => connection.getRepository(Earning),
    inject: ['DATABASE_CONNECTION'],
  },
];
