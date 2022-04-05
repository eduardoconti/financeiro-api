import { CategoryDeleteResponseDTO } from '@category/dto';
import { Category } from '@category/entity';
import { FindCategoryByParams } from '@category/types';

export interface ICategoryRepository {
  insert(category: Category): Promise<Category>;
  update(id: number, category: Category): Promise<Category | null>;
  findById(id: number): Promise<Category | null>;
  findByParams(params: FindCategoryByParams): Promise<Category[] | null>;
  findAll(userId: string): Promise<Category[]>;
  delete(id: number): Promise<CategoryDeleteResponseDTO>;
}
