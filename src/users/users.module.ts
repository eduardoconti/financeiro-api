import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersProviders } from './users.provider';
import { UsersService } from './service/users.service';
import { DatabaseModule } from 'src/db/database.module';
import { PasswordManagerService } from './service/password-mannager.service';
import { Connection } from 'typeorm';
import { Users } from './entity';
import { TYPES } from '@config/dependency-injection';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [{
    provide: TYPES.UserRepository,
    useFactory: (connection: Connection) => connection.getRepository(Users),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: TYPES.UserService,
    useClass: UsersService
  },
  {
    provide: TYPES.PasswordManagerService,
    useClass: PasswordManagerService
  }],
  exports: [{
    provide: TYPES.UserService,
    useClass: UsersService
  },
  {
    provide: TYPES.PasswordManagerService,
    useClass: PasswordManagerService
  }],
})
export class UsersModule { }
