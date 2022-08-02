import { Injectable, Inject } from '@nestjs/common';

import { InsertSubCategoryRequestDTO } from '@category/dto/sub-category';
import { SubCategory } from '@category/entity';
import { ISubCategoryRepository } from '@category/repository/sub-category';

import { TYPES } from '@config/dependency-injection';

import { IInsertSubCategoryService } from './insert-sub-category.service.interface';

@Injectable()
export class InsertSubCategoryService implements IInsertSubCategoryService {
  constructor(
    @Inject(TYPES.SubCategoryRepository)
    private repository: ISubCategoryRepository,
  ) {}

  async insertSubCategory(
    category: InsertSubCategoryRequestDTO,
    userId: string,
  ): Promise<SubCategory> {
    const entity = SubCategory.build({ ...category, userId });
    return await this.repository.insert(entity);
  }
}
