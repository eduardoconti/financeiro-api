import { Inject } from '@nestjs/common';

import { UpdateSubCategoryDTO } from '@category/dto/sub-category';
import { SubCategory } from '@category/entity';
import { ISubCategoryRepository } from '@category/repository/sub-category';

import { TYPES } from '@config/dependency-injection';

import { IGetSubCategoryService } from './get-sub-category.service.interface';
import { IUpdateSubCategoryService } from './update-sub-category.service.interface';

export class UpdateSubCategoryService implements IUpdateSubCategoryService {
  constructor(
    @Inject(TYPES.SubCategoryRepository)
    private readonly repository: ISubCategoryRepository,
    @Inject(TYPES.GetSubCategoryService)
    private getSubCategoryService: IGetSubCategoryService,
  ) {}
  async update(
    id: number,
    userId: string,
    categoryUpdateRequest: UpdateSubCategoryDTO,
  ): Promise<SubCategory> {
    await this.getSubCategoryService.findSubCategoryUserById(id, userId);
    const entity = SubCategory.build({
      userId,
      id,
      ...categoryUpdateRequest,
    });
    return await this.repository.update(entity);
  }
}
