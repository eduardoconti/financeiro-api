import { SubCategory } from '@category/entity';
import { FindSubCategoryByParams } from '@category/types';

export interface IGetSubCategoryService {
  getAllSubCategories(params: FindSubCategoryByParams): Promise<SubCategory[]>;
  findById(id: number): Promise<SubCategory>;
  findSubCategoryUserById(id: number, userId: string): Promise<SubCategory>;
}
