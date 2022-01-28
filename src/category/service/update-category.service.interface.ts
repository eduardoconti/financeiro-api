import { UpdateCategoryDTO } from '@category/dto';
import { Categorias } from '@category/entity';

export interface IUpdateCategoryService {
  update(
    id: number,
    userId: string,
    categoryUpdateRequest: UpdateCategoryDTO,
  ): Promise<Categorias>;
}
