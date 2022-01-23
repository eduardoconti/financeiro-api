import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { despesasProviders } from './despesas.providers';
import { DespesaService } from './service/expense.service';
import { DespesasController } from './despesas.controller';
import { DespesasMiddleware } from './middleware/despesas.middleware';
import { TYPES } from '@config/dependency-injection';

@Module({
  imports: [DatabaseModule],
  controllers: [DespesasController],
  providers: [...despesasProviders,
  {
    provide: TYPES.ExpenseService,
    useClass: DespesaService
  }],
  exports: [{
    provide: TYPES.ExpenseService,
    useClass: DespesaService
  }]
})
export class DespesasModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DespesasMiddleware).forRoutes(DespesasController);
  }
}
