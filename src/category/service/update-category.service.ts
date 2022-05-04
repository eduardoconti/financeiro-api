import { Inject } from '@nestjs/common';

import { UpdateCategoryDTO } from '@category/dto';
import { Category } from '@category/entity';
import { CategoryNotFoundException } from '@category/exception';
import { CategoryMapper } from '@category/helpers';
import { ICategoryRepository } from '@category/repository';

import { TYPES } from '@config/dependency-injection';

import { IGetCategoryService } from './get-category.service.interface';
import { IUpdateCategoryService } from './update-category.service.interface';

export class UpdateCategoryService implements IUpdateCategoryService {
  constructor(
    @Inject(TYPES.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(TYPES.GetCategoryService)
    private getCategoryService: IGetCategoryService,
  ) {}
  async update(
    id: number,
    userId: string,
    categoryUpdateRequest: UpdateCategoryDTO,
  ): Promise<Category> {
    await this.getCategoryService.findCategoryUserById(id, userId);
    const entity = Category.build({
      userId,
      id,
      descricao: categoryUpdateRequest.descricao,
    });
    const category = await this.categoryRepository.update(id, entity);
    if (!category) {
      throw new CategoryNotFoundException(null, categoryUpdateRequest);
    }
    return category;
  }
}
