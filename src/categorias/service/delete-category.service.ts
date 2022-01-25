import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { CategoryDeleteResponseDTO } from '@categorias/dto';
import { ICategoryRepository } from '@categorias/repository';

import { TYPES } from '@config/dependency-injection';

import { IDeleteCategoryService } from './delete-category.service.interface';

@Injectable()
export class DeleteCategoryService implements IDeleteCategoryService {
  constructor(
    @Inject(TYPES.CategoryRepository)
    private categoryRepository: ICategoryRepository,
  ) {}

  async deleteCategory(id: number): Promise<CategoryDeleteResponseDTO> {
    try {
      return await this.categoryRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
