import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@users/users.module';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '../db/database.module';
import { DespesasController } from './despesas.controller';
import { despesasProviders } from './despesas.providers';
import { Despesas } from './entity';
import { DespesasMiddleware } from './middleware/despesas.middleware';
import { ExpenseRepository } from './repository';
import { GetExpenseService } from './service';
import { DespesaService } from './service/expense.service';

@Module({
  imports: [DatabaseModule, UsersModule, TypeOrmModule.forFeature([Despesas])],
  controllers: [DespesasController],
  providers: [
    ...despesasProviders,
    {
      provide: TYPES.ExpenseService,
      useClass: DespesaService,
    },
    {
      provide: TYPES.Repo,
      useClass: ExpenseRepository,
    },
    {
      provide: TYPES.GetExpenseService,
      useClass: GetExpenseService,
    },
  ],
  exports: [
    {
      provide: TYPES.ExpenseService,
      useClass: DespesaService,
    },
  ],
})
export class DespesasModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DespesasMiddleware).forRoutes(DespesasController);
  }
}
