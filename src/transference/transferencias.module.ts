import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/users.module';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '@db/database.module';

import { TransferenciaService } from './service';
import { TransferenciasController } from './transferencias.controller';
import { transferenciasProviders } from './transferencias.providers';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [TransferenciasController],
  providers: [
    ...transferenciasProviders,
    { provide: TYPES.TransferenceService, useClass: TransferenciaService },
  ],
})
export class TransferenciasModule {}
