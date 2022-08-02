import { Injectable, Inject } from '@nestjs/common';

import { SubCategory } from '@category/entity';
import {
  ForbiddenSubCategoryException,
  SubCategoryNotFoundException,
} from '@category/exception/sub-category';
import { ISubCategoryRepository } from '@category/repository/sub-category';
import { FindSubCategoryByParams } from '@category/types';

import { TYPES } from '@config/dependency-injection';

import { IGetSubCategoryService } from './get-sub-category.service.interface';

@Injectable()
export class GetSubCategoryService implements IGetSubCategoryService {
  constructor(
    @Inject(TYPES.SubCategoryRepository)
    private readonly repository: ISubCategoryRepository,
  ) {}

  async findById(id: number): Promise<SubCategory> {
    const subCategory = await this.repository.findById(id);

    if (!subCategory) {
      throw new SubCategoryNotFoundException();
    }
    return subCategory;
  }

  async findSubCategoryUserById(
    id: number,
    userId: string,
  ): Promise<SubCategory> {
    const subCategory = await this.repository.findById(id);

    if (!subCategory) {
      throw new SubCategoryNotFoundException();
    }
    if (subCategory.userId !== userId) {
      throw new ForbiddenSubCategoryException();
    }
    return subCategory;
  }

  async getAllSubCategories(
    params: FindSubCategoryByParams,
  ): Promise<SubCategory[]> {
    const categories = await this.repository.findByParams(params);
    if (!categories) {
      throw new SubCategoryNotFoundException();
    }
    return categories;
  }
}
