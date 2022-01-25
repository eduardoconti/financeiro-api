import { Categorias } from '@categorias/entity';

export interface IGetCategoryService {
  getAllCategories(userId: string): Promise<Categorias[]>;
  getOne(id: number): Promise<Categorias>;
}
