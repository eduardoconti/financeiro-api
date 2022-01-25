import { CategoryDTO } from '@categorias/dto';
import { Categorias } from '@categorias/entity';

export interface IUpdateCategoryService {
  update(id: number, categoryUpdateRequest: CategoryDTO): Promise<Categorias>;
}
