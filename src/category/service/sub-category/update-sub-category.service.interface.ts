import { UpdateSubCategoryDTO } from '@category/dto/sub-category';
import { SubCategory } from '@category/entity';

export interface IUpdateSubCategoryService {
  update(
    id: number,
    userId: string,
    categoryUpdateRequest: UpdateSubCategoryDTO,
  ): Promise<SubCategory>;
}
