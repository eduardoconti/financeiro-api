import { Module } from '@nestjs/common';

import { ReceitasModule } from '@receitas/receitas.module';

import { TYPES } from '@config/dependency-injection';

import { DespesasModule } from '@despesas/despesas.module';

import { GraphicController } from './graphic.controller';
import { GraphicService } from './service';

@Module({
  controllers: [GraphicController],
  providers: [{ provide: TYPES.GraphicService, useClass: GraphicService }],
  imports: [DespesasModule, ReceitasModule],
})
export class GraphicModule {}
