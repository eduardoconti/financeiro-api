import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TYPES } from '@config/dependency-injection';

import { Transferencias } from './entity';
import { TransferenceRepository } from './repository';
import {
  DeleteTransferenceService,
  GetTransferenceService,
  InsertTransferenceService,
  UpdateTransferenceService,
} from './service';
import { TransferenciasController } from './transferencias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transferencias])],
  controllers: [TransferenciasController],
  providers: [
    { provide: TYPES.GetTransferenceService, useClass: GetTransferenceService },
    {
      provide: TYPES.InsertTransferenceService,
      useClass: InsertTransferenceService,
    },
    {
      provide: TYPES.UpdateTransferenceService,
      useClass: UpdateTransferenceService,
    },
    {
      provide: TYPES.DeleteTransferenceService,
      useClass: DeleteTransferenceService,
    },
    {
      provide: TYPES.TransferenceRepository,
      useClass: TransferenceRepository,
    },
  ],
})
export class TransferenciasModule {}
