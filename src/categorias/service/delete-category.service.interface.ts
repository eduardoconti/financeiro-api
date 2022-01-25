import { CategoryDeleteResponseDTO } from '@categorias/dto';

export interface IDeleteCategoryService {
  deleteCategory(id: number): Promise<CategoryDeleteResponseDTO>;
}
