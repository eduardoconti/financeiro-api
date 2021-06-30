import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersProviders } from './users.provider';
import { UsersService } from './service/users.service';
import { DatabaseModule } from 'src/db/database.module';
import { PasswordManagerService } from './service/password-mannager.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [...UsersProviders, UsersService, PasswordManagerService],
  exports: [UsersService, PasswordManagerService],
})
export class UsersModule {}
