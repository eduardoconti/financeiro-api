import { Module } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '../db/database.module';
import { ReceitasController } from './receitas.controller';
import { ReceitasProviders } from './receitas.providers';
import { ReceitaService } from './service/earning.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReceitasController],
  providers: [
    ...ReceitasProviders,
    { provide: TYPES.EarningService, useClass: ReceitaService },
  ],
  exports: [{ provide: TYPES.EarningService, useClass: ReceitaService }],
})
export class ReceitasModule {}
