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
    const { id } = await this.repository.save(newCategory).catch(error => {
      throw new InsertCategoryException(error, category);
    });
    return await this.findOneOrFail(id as number);
  }

  async update(category: Category): Promise<Category> {
    const { id } = await this.repository.save(category).catch(error => {
      throw new UpdateCategoryException(error, category);
    });
    return await this.findOneOrFail(id as number);
  }

  async findById(id: number): Promise<Category | null> {
    const result = await this.repository
      .find({
        where: { id: id },
        relations: ['subCategories'],
        select: { userId: false },
      })
      .catch(error => {
        throw new FindCategoryException(error);
      });
    return result[0];
  }

  async findByParams(params: FindCategoryByParams): Promise<Category[] | null> {
    return await this.repository
      .find({
        relations: { user: true, subCategories: true },
        where: params,
        order: {
          descricao: 'ASC',
          subCategories: {
            description: 'ASC',
          },
        },
        select: { userId: false },
      })
      .catch(error => {
        throw new FindCategoryException(error, { params: params });
      });
  }

  async delete(category: Category): Promise<CategoryDeleteResponseDTO> {
    await this.repository.delete(category).catch(error => {
      throw new DeleteCategoryException(error);
    });
    return new CategoryDeleteResponseDTO(true);
  }

  async findOneOrFail(id: number): Promise<Category> {
    const result = await this.repository
      .find({
        where: { id: id },
        relations: ['subCategories'],
        select: { userId: false },
      })
      .catch(error => {
        throw new FindCategoryException(error);
      });

    if (!result || !result.length) {
      throw new FindCategoryException();
    }

    return result[0];
  }

  async exists({
    id,
    userId,
  }: Pick<Category, 'id' | 'userId'>): Promise<boolean> {
    const result = await this.repository
      .find({
        where: { id, userId },
        select: { id: true },
      })
      .catch(error => {
        throw new FindCategoryException(error);
      });

    if (!result || !result.length) return false;
    return true;
  }
}
