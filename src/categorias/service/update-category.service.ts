import { BadRequestException, Inject } from '@nestjs/common';

import { CategoryDTO } from '@categorias/dto';
import { Categorias } from '@categorias/entity';
import { ICategoryRepository } from '@categorias/repository';

import { TYPES } from '@config/dependency-injection';

import { IUpdateCategoryService } from './update-category.service.interface';

export class UpdateCategoryService implements IUpdateCategoryService {
  constructor(
    @Inject(TYPES.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}
  async update(
    id: number,
    categoryUpdateRequest: CategoryDTO,
  ): Promise<Categorias> {
    try {
      return await this.categoryRepository.update(id, categoryUpdateRequest);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
