import { Categorias } from '@category/entity';

export interface IGetCategoryService {
  getAllCategories(userId: string): Promise<Categorias[]>;
  findById(id: number): Promise<Categorias>;
  findCategoryUserById(id: number, userId: string): Promise<Categorias>;
}
