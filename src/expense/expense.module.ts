import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '@db/database.module';

import { Despesas } from './entity';
import { ExpenseController } from './expense.controller';
import { DespesasMiddleware } from './middleware/expense.middleware';
import { ExpenseRepository } from './repository';
import {
  DeleteExpenseService,
  GetExpenseService,
  InsertExpenseService,
} from './service';
import { UpdateExpenseService } from './service/update-expense.service';

@Module({
  imports: [TypeOrmModule.forFeature([Despesas]), DatabaseModule],
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
export class DespesasModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DespesasMiddleware).forRoutes(ExpenseController);
  }
}
