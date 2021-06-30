import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { categoriasProviders } from './categorias.providers';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './service/categorias.service';
@Module({
  imports: [DatabaseModule],
  controllers: [CategoriasController],
  providers: [...categoriasProviders, CategoriasService],
})
export class CategoriasModule {}
