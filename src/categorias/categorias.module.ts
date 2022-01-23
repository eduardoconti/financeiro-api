import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { categoriasProviders } from './categorias.providers';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './service/categorias.service';
import { TYPES } from '@config/dependency-injection';
@Module({
  imports: [DatabaseModule],
  controllers: [CategoriasController],
  providers: [...categoriasProviders, {
    provide: TYPES.CategoriaService,
    useClass: CategoriasService
  }],
})
export class CategoriasModule { }
