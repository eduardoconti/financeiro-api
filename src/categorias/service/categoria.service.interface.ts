import { CategoriaDeleteResponseDTO, CategoriasDTO } from '@categorias/dto';
import { Categorias } from '@categorias/entity';

export interface ICategoriaService {
  getOne(id: number): Promise<Categorias>;
  retornaTodasCategorias(userId: string): Promise<Categorias[]>;
  insereCategoria(categoria: CategoriasDTO): Promise<Categorias>;
  deletaCategoria(id: number): Promise<CategoriaDeleteResponseDTO>;
  alteraCategoria(id: number, categoria: CategoriasDTO): Promise<Categorias>;
}
