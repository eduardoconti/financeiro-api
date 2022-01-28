import { Connection } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import { Despesas } from './entity/despesas.entity';

export const despesasProviders = [
  {
    provide: TYPES.ExpenseRepository,
    useFactory: (connection: Connection) => connection.getRepository(Despesas),
    inject: ['DATABASE_CONNECTION'],
  },
];
