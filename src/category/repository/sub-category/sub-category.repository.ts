import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubCategoryDeleteResponseDTO } from '@category/dto/sub-category';
import { SubCategory } from '@category/entity';
import {
  DeleteSubCategoryException,
  FindSubCategoryException,
  InsertSubCategoryException,
  UpdateSubCategoryException,
} from '@category/exception/sub-category';
import { FindSubCategoryByParams } from '@category/types';

import { ISubCategoryRepository } from './sub-category.repository.interface';

@Injectable()
export class SubCategoryRepository implements ISubCategoryRepository {
  constructor(
    @InjectRepository(SubCategory)
    private readonly repository: Repository<SubCategory>,
  ) {}

  async insert(category: SubCategory): Promise<SubCategory> {
    const newSubCategory = this.repository.create(category);

    return await this.repository.save(newSubCategory).catch(error => {
      throw new InsertSubCategoryException(error, category);
    });
  }

  async update(category: SubCategory): Promise<SubCategory> {
    return await this.repository.save(category).catch(error => {
      throw new UpdateSubCategoryException(error, category);
    });
  }

  async findById(id: number): Promise<SubCategory | null> {
    return await this.repository
      .findOne({
        where: { id: id },
        relations: ['user', 'category'],
      })
      .catch(error => {
        throw new FindSubCategoryException(error);
      });
  }

  async findByParams(
    params: FindSubCategoryByParams,
  ): Promise<SubCategory[] | null> {
    return await this.repository
      .find({
        relations: ['user', 'category'],
        where: params,
        order: { description: 'ASC' },
      })
      .catch(error => {
        throw new FindSubCategoryException(error, { params: params });
      });
  }

  async delete(category: SubCategory): Promise<SubCategoryDeleteResponseDTO> {
    await this.repository.remove(category).catch(error => {
      throw new DeleteSubCategoryException(error);
    });
    return new SubCategoryDeleteResponseDTO(true);
  }

  async exists({
    id,
    userId,
  }: Pick<SubCategory, 'id' | 'userId'>): Promise<boolean> {
    const result = await this.repository
      .find({
        where: { id, userId },
        select: { id: true },
      })
      .catch(error => {
        throw new FindSubCategoryException(error);
      });

    if (!result || !result.length) return false;
    return true;
  }
}
