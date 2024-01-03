import { Injectable, Inject } from '@nestjs/common';

import { CategoryDeleteResponseDTO } from '@category/dto';
import { ICategoryRepository } from '@category/repository';

import { TYPES } from '@config/dependency-injection';

import { IDeleteCategoryService } from './delete-category.service.interface';
import { IGetCategoryService } from './get-category.service.interface';

@Injectable()
export class DeleteCategoryService implements IDeleteCategoryService {
  constructor(
    @Inject(TYPES.CategoryRepository)
    private categoryRepository: ICategoryRepository,
    @Inject(TYPES.GetCategoryService)
    private getCategoryService: IGetCategoryService,
  ) {}

  async deleteCategory(
    id: number,
    userId: string,
  ): Promise<CategoryDeleteResponseDTO> {
    const category = await this.getCategoryService.findOne(
      id,
      userId,
    );

    return await this.categoryRepository.delete(category);
  }
}
