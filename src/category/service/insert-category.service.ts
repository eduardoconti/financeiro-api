import { Injectable, Inject } from '@nestjs/common';

import { InsertCategoryRequestDTO } from '@category/dto';
import { Categorias } from '@category/entity';
import { CategoryMapper } from '@category/helpers';
import { ICategoryRepository } from '@category/repository';

import { TYPES } from '@config/dependency-injection';

import { IInsertCategoryService } from './insert-category.service.interface';

@Injectable()
export class InsertCategoryService implements IInsertCategoryService {
  constructor(
    @Inject(TYPES.CategoryRepository)
    private categoryRepository: ICategoryRepository,
  ) {}

  async insertCategory(
    category: InsertCategoryRequestDTO,
    userId: string,
  ): Promise<Categorias> {
    const entity = CategoryMapper.toEntity(category, userId);
    return await this.categoryRepository.insert(entity);
  }
}
