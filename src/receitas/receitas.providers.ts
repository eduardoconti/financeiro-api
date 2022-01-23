import { Connection } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import { Receitas } from './entity/receitas.entity';

export const ReceitasProviders = [
  {
    provide: TYPES.EarningRepository,
    useFactory: (connection: Connection) => connection.getRepository(Receitas),
    inject: ['DATABASE_CONNECTION'],
  },
];
