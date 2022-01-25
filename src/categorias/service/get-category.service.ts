import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { Categorias } from '@categorias/entity';
import { ICategoryRepository } from '@categorias/repository';

import { TYPES } from '@config/dependency-injection';

import { IGetCategoryService } from './get-category.service.interface';

@Injectable()
export class GetCategoryService implements IGetCategoryService {
  constructor(
    @Inject(TYPES.CategoryRepository)
    private readonly categoriaRepository: ICategoryRepository,
  ) {}

  async getOne(id: number): Promise<Categorias> {
    try {
      return this.categoriaRepository.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllCategories(userId: string): Promise<Categorias[]> {
    try {
      return await this.categoriaRepository.findAll(userId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
