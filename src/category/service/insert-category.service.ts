import { Injectable, Inject } from '@nestjs/common';

import { InsertCategoryRequestDTO } from '@category/dto';
import { Category } from '@category/entity';
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
  ): Promise<Category> {
    const entity = Category.build({ ...category, userId });
    return await this.categoryRepository.insert(entity);
  }
}
