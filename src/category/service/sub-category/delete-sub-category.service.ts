import { Injectable, Inject } from '@nestjs/common';

import { SubCategoryDeleteResponseDTO } from '@category/dto/sub-category';
import { ISubCategoryRepository } from '@category/repository/sub-category';

import { TYPES } from '@config/dependency-injection';

import { IDeleteSubCategoryService } from './delete-sub-category.service.interface';
import { IGetSubCategoryService } from './get-sub-category.service.interface';

@Injectable()
export class DeleteSubCategoryService implements IDeleteSubCategoryService {
  constructor(
    @Inject(TYPES.SubCategoryRepository)
    private repository: ISubCategoryRepository,
    @Inject(TYPES.GetSubCategoryService)
    private getSubCategoryService: IGetSubCategoryService,
  ) {}

  async deleteSubCategory(
    id: number,
    userId: string,
  ): Promise<SubCategoryDeleteResponseDTO> {
    const category = await this.getSubCategoryService.findSubCategoryUserById(
      id,
      userId,
    );

    return await this.repository.delete(category);
  }
}
