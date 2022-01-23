import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '../db/database.module';
import { DespesasController } from './despesas.controller';
import { despesasProviders } from './despesas.providers';
import { DespesasMiddleware } from './middleware/despesas.middleware';
import { DespesaService } from './service/expense.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DespesasController],
  providers: [
    ...despesasProviders,
    {
      provide: TYPES.ExpenseService,
      useClass: DespesaService,
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
