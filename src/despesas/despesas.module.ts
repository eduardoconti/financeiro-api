import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { despesasProviders } from './despesas.providers';
import { DespesaService } from './service/despesas.service';
import { DespesasController } from './despesas.controller';
import { DespesasMiddleware } from './middleware/despesas.middleware';

@Module({
  imports: [DatabaseModule],
  controllers: [DespesasController],
  providers: [...despesasProviders, DespesaService],
})
export class DespesasModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DespesasMiddleware).forRoutes(DespesasController);
  }
}
