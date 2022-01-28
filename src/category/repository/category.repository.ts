import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryDeleteResponseDTO } from '@category/dto';
import { Categorias } from '@category/entity';
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
    @InjectRepository(Categorias)
    private readonly repository: Repository<Categorias>,
  ) {}

  async insert(category: Categorias): Promise<Categorias> {
    try {
      const newCategory = this.repository.create(category);
      await this.repository.save(newCategory);
      return newCategory;
    } catch (error) {
      throw new InsertCategoryException(error);
    }
  }

  async update(
    id: number,
    category: Categorias,
  ): Promise<Categorias | undefined> {
    try {
      await this.repository.update({ id }, category);
      return await this.repository.findOne(id);
    } catch (error) {
      throw new UpdateCategoryException(error);
    }
  }

  async findById(id: number): Promise<Categorias | undefined> {
    try {
      return await this.repository.findOne(id, {
        relations: ['user'],
      });
    } catch (error) {
      throw new FindCategoryException(error);
    }
  }

  async findByParams(
    params: FindCategoryByParams,
  ): Promise<Categorias[] | undefined> {
    try {
      return await this.repository.find({
        relations: ['user'],
        where: params,
      });
    } catch (error) {
      throw new FindCategoryException(error, { params: params });
    }
  }

  async findAll(userId: string): Promise<Categorias[]> {
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
