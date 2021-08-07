import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/shared/constants/messages';
import { Repository } from 'typeorm';
import { CategoriasDTO } from '../dto/categorias.dto';
import { Categorias } from '../entity/categorias.entity';

@Injectable()
export class CategoriasService {
  constructor(
    @Inject('CATEGORIAS')
    private categoriaRepository: Repository<Categorias>,
  ) {}

  async getOne(id: number, userId?: string): Promise<Categorias> {
    try {
      let categoria = await this.categoriaRepository.findOneOrFail(
        { id },
        { relations: ['user'] },
      );
      if (userId && categoria.user.id !== userId) {
        throw new UnauthorizedException(
          ERROR_MESSAGES.USER_TOKEN_NOT_EQUALS_TO_PARAM_URL,
        );
      }
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
    userId: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.getOne(id, userId);
      await this.categoriaRepository.delete({ id });
      return { deleted: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraCategoria(
    id: number,
    categoria: CategoriasDTO,
    userId: string,
  ): Promise<Categorias> {
    try {
      await this.getOne(id, userId);
      await this.categoriaRepository.update({ id }, categoria);
      return await this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
