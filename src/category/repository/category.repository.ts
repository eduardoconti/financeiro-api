import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryDeleteResponseDTO } from '@category/dto';
import { Category } from '@category/entity';
import {
  DeleteCategoryException,
  FindCategoryException,
  InsertCategoryException,
  UpdateCategoryException,
} from '@category/exception';
import { FindCategoryByParams } from '@category/types';

import { ICategoryRepository } from './category.repository.interface';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async insert(category: Category): Promise<Category> {
    const newCategory = this.repository.create(category);

    return await this.repository.save(newCategory).catch((error) => {
      throw new InsertCategoryException(error, category);
    });
  }

  async update(category: Category): Promise<Category> {
    return await this.repository.save(category).catch((error) => {
      throw new UpdateCategoryException(error, category);
    });
  }

  async findById(id: number): Promise<Category | null> {
    return await this.repository
      .findOne({
        where: { id: id },
        relations: ['user', 'subCategories'],
      })
      .catch((error) => {
        throw new FindCategoryException(error);
      });
  }

  async findByParams(params: FindCategoryByParams): Promise<Category[] | null> {
    return await this.repository
      .find({
        relations: ['user', 'subCategories'],
        where: params,
        order: { descricao: 'ASC' },
      })
      .catch((error) => {
        throw new FindCategoryException(error, { params: params });
      });
  }

  async delete(category: Category): Promise<CategoryDeleteResponseDTO> {
    await this.repository.remove(category).catch((error) => {
      throw new DeleteCategoryException(error);
    });
    return new CategoryDeleteResponseDTO(true);
  }
}
