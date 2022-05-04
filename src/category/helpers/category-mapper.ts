import { Category } from '@category/entity';

export class CategoryMapper {
  static toEntity = (
    dto: Omit<Category, 'userId'> & { id?: number },
    userId: string,
    id?: number,
  ) => {
    const { descricao } = dto;
    return Category.build({ userId, descricao, id });
  };
}
