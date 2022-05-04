import { Module } from '@nestjs/common';

import { ReceitasModule } from '@earning/earning.module';

import { TYPES } from '@config/dependency-injection';

import { DespesasModule } from '@expense/expense.module';

import { GraphicController } from './graphic.controller';
import { GraphicService } from './service';

@Module({
  controllers: [GraphicController],
  providers: [{ provide: TYPES.GraphicService, useClass: GraphicService }],
  imports: [DespesasModule, ReceitasModule],
})
export class GraphicModule {}
