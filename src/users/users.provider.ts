import { Connection } from 'typeorm';

import { Users } from './entity/users.entity';

export const UsersProviders = [
  {
    provide: 'USERS',
    useFactory: (connection: Connection) => connection.getRepository(Users),
    inject: ['DATABASE_CONNECTION'],
  },
];
