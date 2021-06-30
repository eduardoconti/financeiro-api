import { Connection, Repository } from 'typeorm';
import { Transferencias } from './entity/transferencias.entity';

export const transferenciasProviders = [
  {
    provide: 'TRANSFERENCIAS',
    useFactory: (connection: Connection) =>
      connection.getRepository(Transferencias),
    inject: ['DATABASE_CONNECTION'],
  },
];
