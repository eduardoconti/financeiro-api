import { ReceitasModule } from './../receitas/receitas.module';
import { DespesasModule } from './../despesas/despesas.module';
import { DespesaService } from './../despesas/service/despesas.service';
import { Module } from '@nestjs/common';
import { GraphicController } from './graphic.controller';
import { GraphicService } from './service/graphic.service';
import { ReceitaService } from 'src/receitas/service/receitas.service';

@Module({
  controllers: [GraphicController],
  providers: [GraphicService],
  imports: [DespesasModule, ReceitasModule]
})
export class GraphicModule { }
