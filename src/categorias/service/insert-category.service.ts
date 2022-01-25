import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { CategoryDTO } from '@categorias/dto';
import { Categorias } from '@categorias/entity';
import { ICategoryRepository } from '@categorias/repository';

import { TYPES } from '@config/dependency-injection';

import { IInsertCategoryService } from './insert-category.service.interface';

@Injectable()
export class InsertCategoryService implements IInsertCategoryService {
  constructor(
    @Inject(TYPES.CategoryRepository)
    private categoryRepository: ICategoryRepository,
  ) {}

  async insertCategory(category: CategoryDTO): Promise<Categorias> {
    try {
      return await this.categoryRepository.insert(category);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
