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
    try {
      const newCategory = this.repository.create(category);
      await this.repository.save(newCategory);
      return newCategory;
    } catch (error) {
      throw new InsertCategoryException(error);
    }
  }

  async update(id: number, category: Category): Promise<Category | null> {
    try {
      await this.repository.update({ id }, category);
      return await this.repository.findOne({ where: { id: id } });
    } catch (error) {
      throw new UpdateCategoryException(error);
    }
  }

  async findById(id: number): Promise<Category | null> {
    try {
      return await this.repository.findOne({
        where: { id: id },
        relations: ['user'],
      });
    } catch (error) {
      throw new FindCategoryException(error);
    }
  }

  async findByParams(params: FindCategoryByParams): Promise<Category[] | null> {
    try {
      return await this.repository.find({
        relations: ['user'],
        where: params,
        order: { descricao: 'ASC' },
      });
    } catch (error) {
      throw new FindCategoryException(error, { params: params });
    }
  }

  async findAll(userId: string): Promise<Category[]> {
    try {
      return await this.repository.find({
        order: { id: 'ASC' },
        relations: ['user'],
        where: { userId: userId },
      });
    } catch (error) {
      throw new FindCategoryException(error);
    }
  }

  async delete(id: number): Promise<CategoryDeleteResponseDTO> {
    try {
      await this.repository.delete({ id });
      return new CategoryDeleteResponseDTO(true);
    } catch (error) {
      throw new DeleteCategoryException(undefined, error);
    }
  }
}
