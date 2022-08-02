import { InsertSubCategoryRequestDTO } from '@category/dto/sub-category';
import { SubCategory } from '@category/entity';

export interface IInsertSubCategoryService {
  insertSubCategory(
    category: InsertSubCategoryRequestDTO,
    userId: string,
  ): Promise<SubCategory>;
}
