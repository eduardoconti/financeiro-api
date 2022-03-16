import { Connection } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import { Transferencias } from './entity';

export const transferenciasProviders = [
  {
    provide: TYPES.TransferenceRepository,
    useFactory: (connection: Connection) =>
      connection.getRepository(Transferencias),
    inject: ['DATABASE_CONNECTION'],
  },
];
