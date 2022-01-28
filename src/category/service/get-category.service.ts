import { Injectable, Inject } from '@nestjs/common';

import { Categorias } from '@category/entity';
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

  async findById(id: number): Promise<Categorias> {
    const category = await this.categoriaRepository.findById(id);

    if (!category) {
      throw new CategoryNotFoundException();
    }
    return category;
  }

  async findCategoryUserById(id: number, userId: string): Promise<Categorias> {
    const category = await this.categoriaRepository.findById(id);

    //console.log(category);
    if (!category) {
      throw new CategoryNotFoundException();
    }
    if (category.userId !== userId) {
      throw new ForbiddenCategoryException();
    }
    return category;
  }

  async getAllCategories(userId: string): Promise<Categorias[]> {
    return await this.categoriaRepository.findAll(userId);
  }
}
