import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { Connection } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import { Users } from './entity';
import { PasswordManagerService } from './service/password-mannager.service';
import { UsersService } from './service/users.service';
import { UsersController } from './users.controller';
import { UsersProviders } from './users.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    {
      provide: TYPES.UserRepository,
      useFactory: (connection: Connection) => connection.getRepository(Users),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: TYPES.UserService,
      useClass: UsersService,
    },
    {
      provide: TYPES.PasswordManagerService,
      useClass: PasswordManagerService,
    },
  ],
  exports: [
    {
      provide: TYPES.UserService,
      useClass: UsersService,
    },
    {
      provide: TYPES.PasswordManagerService,
      useClass: PasswordManagerService,
    },
  ],
})
export class UsersModule {}
