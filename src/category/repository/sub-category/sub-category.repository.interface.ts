import { SubCategoryDeleteResponseDTO } from '@category/dto/sub-category';
import { SubCategory } from '@category/entity';
import { FindSubCategoryByParams } from '@category/types';

export interface ISubCategoryRepository {
  insert(category: SubCategory): Promise<SubCategory>;
  update(category: SubCategory): Promise<SubCategory>;
  findById(id: number): Promise<SubCategory | null>;
  findByParams(params: FindSubCategoryByParams): Promise<SubCategory[] | null>;
  delete(category: SubCategory): Promise<SubCategoryDeleteResponseDTO>;
}
