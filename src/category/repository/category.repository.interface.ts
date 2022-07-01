import { CategoryDeleteResponseDTO } from '@category/dto';
import { Category } from '@category/entity';
import { FindCategoryByParams } from '@category/types';

export interface ICategoryRepository {
  insert(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  findById(id: number): Promise<Category | null>;
  findByParams(params: FindCategoryByParams): Promise<Category[] | null>;
  delete(category: Category): Promise<CategoryDeleteResponseDTO>;
}
