import { Categorias } from '@category/entity';

export class CategoryMapper {
  static toEntity = (
    dto: Omit<Categorias, 'userId'> & { id?: number },
    userId: string,
    id?: number,
  ) => {
    const { descricao } = dto;
    return Categorias.build({ userId, descricao, id });
  };
}
