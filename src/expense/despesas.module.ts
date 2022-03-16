import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@users/users.module';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '../db/database.module';
import { DespesasController } from './despesas.controller';
import { Despesas } from './entity';
import { DespesasMiddleware } from './middleware/despesas.middleware';
import { ExpenseRepository } from './repository';
import {
  DeleteExpenseService,
  GetExpenseService,
  InsertExpenseService,
} from './service';
import { UpdateExpenseService } from './service/update-expense.service';

@Module({
  imports: [DatabaseModule, UsersModule, TypeOrmModule.forFeature([Despesas])],
  controllers: [DespesasController],
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
    consumer.apply(DespesasMiddleware).forRoutes(DespesasController);
  }
}
