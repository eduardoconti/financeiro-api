import { Module } from '@nestjs/common';

import { ReceitasModule } from '@earning/earning.module';

import { WalletModule } from '@wallet/wallet.module';

import { TYPES } from '@config/dependency-injection';

import { DespesasModule } from '@expense/expense.module';

import { TransferenceModule } from '@transference/transference.module';

import { DashBoardController } from './dashboard.controller';
import { DashBoardService } from './service';

@Module({
  imports: [DespesasModule, ReceitasModule, WalletModule, TransferenceModule],
  controllers: [DashBoardController],
  providers: [
    {
      provide: TYPES.DashBoardService,
      useClass: DashBoardService,
    },
  ],
  exports: [],
})
export class DashBoardModule {}
