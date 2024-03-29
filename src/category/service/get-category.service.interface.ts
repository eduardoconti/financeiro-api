import { Category } from '@category/entity';

export interface IGetCategoryService {
  getAllCategories(userId: string): Promise<Category[]>;
  findById(id: number): Promise<Category>;
  findOne(id: number, userId: string): Promise<Category>;
}
