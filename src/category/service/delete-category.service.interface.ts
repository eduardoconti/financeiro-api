import { CategoryDeleteResponseDTO } from '@category/dto';

export interface IDeleteCategoryService {
  deleteCategory(
    id: number,
    userId: string,
  ): Promise<CategoryDeleteResponseDTO>;
}
