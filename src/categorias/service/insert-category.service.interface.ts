import { CategoryDTO } from '@categorias/dto';
import { Categorias } from '@categorias/entity';

export interface IInsertCategoryService {
  insertCategory(category: CategoryDTO): Promise<Categorias>;
}
