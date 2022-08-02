import { SubCategoryDeleteResponseDTO } from '@category/dto/sub-category';

export interface IDeleteSubCategoryService {
  deleteSubCategory(
    id: number,
    userId: string,
  ): Promise<SubCategoryDeleteResponseDTO>;
}
