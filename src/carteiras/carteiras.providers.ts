import { Connection } from 'typeorm';
import { Carteiras } from './entity/carteiras.entity';

export const categoriasProviders = [
  {
    provide: 'CARTEIRAS',
    useFactory: (connection: Connection) => connection.getRepository(Carteiras),
    inject: ['DATABASE_CONNECTION'],
  },
];
