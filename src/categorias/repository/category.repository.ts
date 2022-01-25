import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryDeleteResponseDTO, CategoryDTO } from '@categorias/dto';
import { Categorias } from '@categorias/entity';

import { ICategoryRepository } from './category.repository.interface';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Categorias)
    private readonly repository: Repository<Categorias>,
  ) {}

  async insert(categoryRequest: CategoryDTO): Promise<Categorias> {
    try {
      const wallet = this.repository.create(categoryRequest);
      await this.repository.save(wallet);
      return wallet;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, categoryRequest: CategoryDTO): Promise<Categorias> {
    try {
      await this.findById(id);
      await this.repository.update({ id }, categoryRequest);
      return await this.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: number): Promise<Categorias> {
    try {
      const wallet = await this.repository.findOneOrFail(
        { id },
        { relations: ['user'] },
      );

      return wallet;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(userId: string): Promise<Categorias[]> {
    try {
      return await this.repository.find({
        order: { id: 'ASC' },
        relations: ['user'],
        where: { user: userId },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(id: number): Promise<CategoryDeleteResponseDTO> {
    try {
      await this.findById(id);
      await this.repository.delete({ id });
      return new CategoryDeleteResponseDTO(true);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
