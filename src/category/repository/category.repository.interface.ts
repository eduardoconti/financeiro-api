import { CategoryDeleteResponseDTO } from '@category/dto';
import { Categorias } from '@category/entity';
import { FindCategoryByParams } from '@category/types';

export interface ICategoryRepository {
  insert(category: Categorias): Promise<Categorias>;
  update(id: number, category: Categorias): Promise<Categorias | undefined>;
  findById(id: number): Promise<Categorias | undefined>;
  findByParams(params: FindCategoryByParams): Promise<Categorias[] | undefined>;
  findAll(userId: string): Promise<Categorias[]>;
  delete(id: number): Promise<CategoryDeleteResponseDTO>;
}
