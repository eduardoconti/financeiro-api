import { Connection } from 'typeorm';
import { Categorias } from './entity/categorias.entity';

export const categoriasProviders = [
  {
    provide: 'CATEGORIAS',
    useFactory: (connection: Connection) =>
      connection.getRepository(Categorias),
    inject: ['DATABASE_CONNECTION'],
  },
];
