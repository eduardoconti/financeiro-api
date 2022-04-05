import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TYPES } from '@config/dependency-injection';

import { Users } from './entity';
import { UserRepository } from './repository';
import {
  DeleteUserService,
  GetUserService,
  InsertUserService,
  PasswordManagerService,
} from './service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [
    {
      provide: TYPES.UserRepository,
      useClass: UserRepository,
    },
    {
      provide: TYPES.GetUserService,
      useClass: GetUserService,
    },
    {
      provide: TYPES.InsertUserService,
      useClass: InsertUserService,
    },
    {
      provide: TYPES.DeleteUserService,
      useClass: DeleteUserService,
    },
    {
      provide: TYPES.PasswordManagerService,
      useClass: PasswordManagerService,
    },
  ],
  exports: [
    {
      provide: TYPES.GetUserService,
      useClass: GetUserService,
    },
    {
      provide: TYPES.PasswordManagerService,
      useClass: PasswordManagerService,
    },
  ],
})
export class UsersModule {}
