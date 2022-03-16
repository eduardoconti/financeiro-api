import { Module } from '@nestjs/common';
import { DespesasModule } from 'src/expense/despesas.module';

import { ReceitasModule } from '@earning/receitas.module';

import { TYPES } from '@config/dependency-injection';

import { GraphicController } from './graphic.controller';
import { GraphicService } from './service';

@Module({
  controllers: [GraphicController],
  providers: [{ provide: TYPES.GraphicService, useClass: GraphicService }],
  imports: [DespesasModule, ReceitasModule],
})
export class GraphicModule {}
