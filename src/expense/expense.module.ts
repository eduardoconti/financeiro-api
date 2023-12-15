import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from '@category/category.module';

import { WalletModule } from '@wallet/wallet.module';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '@db/database.module';

import { Despesa } from './entity';
import { ExpenseController } from './expense.controller';
import { ExpenseRepository } from './repository';
import {
  DeleteExpenseService,
  GetExpenseService,
  InsertExpenseService,
} from './service';
import { UpdateExpenseService } from './service/update-expense.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Despesa]),
    DatabaseModule,
    WalletModule,
    CategoryModule,
  ],
  controllers: [ExpenseController],
  providers: [
    {
      provide: TYPES.UpdateExpenseService,
      useClass: UpdateExpenseService,
    },
    {
      provide: TYPES.ExpenseRepository,
      useClass: ExpenseRepository,
    },
    {
      provide: TYPES.GetExpenseService,
      useClass: GetExpenseService,
    },
    {
      provide: TYPES.InsertExpenseService,
      useClass: InsertExpenseService,
    },
    {
      provide: TYPES.DeleteExpenseService,
      useClass: DeleteExpenseService,
    },
  ],
  exports: [
    {
      provide: TYPES.GetExpenseService,
      useClass: GetExpenseService,
    },
  ],
})
export class DespesasModule {}
