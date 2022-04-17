import { InsertCategoryRequestDTO } from '@category/dto';
import { Category } from '@category/entity';

export interface IInsertCategoryService {
  insertCategory(
    category: InsertCategoryRequestDTO,
    userId: string,
  ): Promise<Category>;
}
