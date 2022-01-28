import { InsertCategoryRequestDTO } from '@category/dto';
import { Categorias } from '@category/entity';

export interface IInsertCategoryService {
  insertCategory(
    category: InsertCategoryRequestDTO,
    userId: string,
  ): Promise<Categorias>;
}
