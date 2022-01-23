import { CategoriaDeleteResponseDTO } from '@categorias/dto';
import { TYPES } from '@config/dependency-injection';
import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { CategoriasDTO } from '../dto/categorias.dto';
import { Categorias } from '../entity/categorias.entity';
import { ICategoriaService } from './categoria.service.interface';

@Injectable()
export class CategoriasService implements ICategoriaService {
  constructor(
    @Inject(TYPES.CategoriaRepository)
    private readonly categoriaRepository: Repository<Categorias>,
  ) { }

  async getOne(id: number): Promise<Categorias> {
    try {
      let categoria = await this.categoriaRepository.findOneOrFail(
        { id },
        { relations: ['user'] },
      );

      return categoria;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async retornaTodasCategorias(userId: string): Promise<Categorias[]> {
    try {
      return await this.categoriaRepository.find({
        order: { id: 'ASC' },
        relations: ['user'],
        where: { user: userId },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async insereCategoria(categoria: CategoriasDTO): Promise<Categorias> {
    try {
      const newDespesas = await this.categoriaRepository.create(categoria);
      await this.categoriaRepository.save(newDespesas);
      return newDespesas;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletaCategoria(
    id: number,
  ): Promise<CategoriaDeleteResponseDTO> {
    try {
      await this.getOne(id);
      await this.categoriaRepository.delete({ id });
      return new CategoriaDeleteResponseDTO(true);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraCategoria(
    id: number,
    categoria: CategoriasDTO,
  ): Promise<Categorias> {
    try {
      await this.getOne(id);
      await this.categoriaRepository.update({ id }, categoria);
      return await this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
