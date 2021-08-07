import { Connection } from 'typeorm';
import { Despesas } from './entity/despesas.entity';

export const despesasProviders = [
  {
    provide: 'DESPESAS',
    useFactory: (connection: Connection) => connection.getRepository(Despesas),
    inject: ['DATABASE_CONNECTION'],
  },
];
