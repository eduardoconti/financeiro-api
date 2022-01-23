import { Module } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '../db/database.module';
import { CategoriasController } from './categorias.controller';
import { categoriasProviders } from './categorias.providers';
import { CategoriasService } from './service/categorias.service';
@Module({
  imports: [DatabaseModule],
  controllers: [CategoriasController],
  providers: [
    ...categoriasProviders,
    {
      provide: TYPES.CategoriaService,
      useClass: CategoriasService,
    },
  ],
})
export class CategoriasModule {}
