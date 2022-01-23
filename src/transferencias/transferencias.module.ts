import { Module } from '@nestjs/common';

import { DatabaseModule } from '../db/database.module';
import { TransferenciaService } from './service/transferencias.service';
import { TransferenciasController } from './transferencias.controller';
import { transferenciasProviders } from './transferencias.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [TransferenciasController],
  providers: [...transferenciasProviders, TransferenciaService],
})
export class TransferenciasModule {}
