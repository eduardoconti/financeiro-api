import { Injectable, Inject } from '@nestjs/common';

import { Category } from '@category/entity';
import {
  CategoryNotFoundException,
  ForbiddenCategoryException,
} from '@category/exception';
import { ICategoryRepository } from '@category/repository';

import { TYPES } from '@config/dependency-injection';

import { IGetCategoryService } from './get-category.service.interface';

@Injectable()
export class GetCategoryService implements IGetCategoryService {
  constructor(
    @Inject(TYPES.CategoryRepository)
    private readonly categoriaRepository: ICategoryRepository,
  ) {}

  async findById(id: number): Promise<Category> {
    const category = await this.categoriaRepository.findById(id);

    if (!category) {
      throw new CategoryNotFoundException();
    }
    return category;
  }

  async findCategoryUserById(id: number, userId: string): Promise<Category> {
    const category = await this.categoriaRepository.findById(id);

    if (!category) {
      throw new CategoryNotFoundException();
    }
    if (category.userId !== userId) {
      throw new ForbiddenCategoryException();
    }
    return category;
  }

  async getAllCategories(userId: string): Promise<Category[]> {
    const categories = await this.categoriaRepository.findByParams({ userId });
    if (!categories) {
      throw new CategoryNotFoundException();
    }
    return categories;
  }
}
