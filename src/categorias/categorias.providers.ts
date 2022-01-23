import { TYPES } from '@config/dependency-injection';
import { Connection } from 'typeorm';
import { Categorias } from './entity/categorias.entity';

export const categoriasProviders = [
  {
    provide: TYPES.CategoriaRepository,
    useFactory: (connection: Connection) =>
      connection.getRepository(Categorias),
    inject: ['DATABASE_CONNECTION'],
  },
];
