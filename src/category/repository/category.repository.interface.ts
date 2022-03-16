import { CategoryDeleteResponseDTO } from '@category/dto';
import { Category } from '@category/entity';
import { FindCategoryByParams } from '@category/types';

export interface ICategoryRepository {
  insert(category: Category): Promise<Category>;
  update(id: number, category: Category): Promise<Category | undefined>;
  findById(id: number): Promise<Category | undefined>;
  findByParams(params: FindCategoryByParams): Promise<Category[] | undefined>;
  findAll(userId: string): Promise<Category[]>;
  delete(id: number): Promise<CategoryDeleteResponseDTO>;
}
