import { Module } from '@nestjs/common';

import { DatabaseModule } from '../db/database.module';
import { ReceitasController } from './receitas.controller';
import { ReceitasProviders } from './receitas.providers';
import { ReceitaService } from './service/receitas.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReceitasController],
  providers: [...ReceitasProviders, ReceitaService],
  exports: [ReceitaService],
})
export class ReceitasModule {}
