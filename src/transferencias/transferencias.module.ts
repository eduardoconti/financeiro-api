import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { transferenciasProviders } from './transferencias.providers';
import { TransferenciasController } from './transferencias.controller';
import { TransferenciaService } from './service/transferencias.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TransferenciasController],
  providers: [...transferenciasProviders, TransferenciaService],
})
export class TransferenciasModule {}
