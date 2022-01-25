import { CategoryDeleteResponseDTO, CategoryDTO } from '@categorias/dto';
import { Categorias } from '@categorias/entity';

export interface ICategoryRepository {
  insert(categoryRequest: CategoryDTO): Promise<Categorias>;
  update(id: number, categoryRequest: CategoryDTO): Promise<Categorias>;
  findById(id: number): Promise<Categorias>;
  findAll(userId: string): Promise<Categorias[]>;
  delete(id: number): Promise<CategoryDeleteResponseDTO>;
}
