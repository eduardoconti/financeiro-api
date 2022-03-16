import { UpdateCategoryDTO } from '@category/dto';
import { Category } from '@category/entity';

export interface IUpdateCategoryService {
  update(
    id: number,
    userId: string,
    categoryUpdateRequest: UpdateCategoryDTO,
  ): Promise<Category>;
}
