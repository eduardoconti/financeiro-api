import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CategoryDeleteResponseDTO } from '@category/dto';
import { Category } from '@category/entity';
import {
  DeleteCategoryException,
  FindCategoryException,
  InsertCategoryException,
  UpdateCategoryException,
} from '@category/exception';
import { fakeCategoryEntity } from '@category/mocks';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';

import { CategoryRepository } from './category.repository';
import { ICategoryRepository } from './category.repository.interface';

describe('CategoryRepository', () => {
  let ormRepository: Repository<Category>;
  let categoryRepository: ICategoryRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.CategoryRepository,
          useClass: CategoryRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOneOrFail: jest.fn(),
            delete: jest.fn()
          },
        },
      ],
    }).compile();
    categoryRepository = module.get<ICategoryRepository>(
      TYPES.CategoryRepository,
    );
    ormRepository = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(categoryRepository).toBeDefined();
    expect(ormRepository).toBeDefined();
  });

  it('should be insert a category', async () => {
    jest
      .spyOn(ormRepository, 'save')
      .mockResolvedValue(fakeCategoryEntity);

    jest
      .spyOn(ormRepository, 'find')
      .mockResolvedValue([fakeCategoryEntity]);

    const result = await categoryRepository.insert(fakeCategoryEntity);

    expect(result).toEqual(fakeCategoryEntity);
  });

  it('should throw InsertCategoryException', async () => {
    jest
      .spyOn(ormRepository, 'save')
      .mockRejectedValue(new Error());

    await expect(categoryRepository.insert(fakeCategoryEntity)).rejects.toThrow(
      new InsertCategoryException(),
    );
  });

  it('should be update a category', async () => {
    jest
      .spyOn(ormRepository, 'save')
      .mockResolvedValue(fakeCategoryEntity);

    jest
      .spyOn(ormRepository, 'find')
      .mockResolvedValue([fakeCategoryEntity]);

    const result = await categoryRepository.update(fakeCategoryEntity);

    expect(result).toEqual(fakeCategoryEntity);
    expect(ormRepository.save).toHaveBeenCalledWith(fakeCategoryEntity);
  });

  it('should throw UpdateCategoryException', async () => {
    jest
      .spyOn(ormRepository, 'save')
      .mockRejectedValue(new Error());

    await expect(categoryRepository.update(fakeCategoryEntity)).rejects.toThrow(
      new UpdateCategoryException(),
    );
  });

  it('should be find a category by id', async () => {
    jest
      .spyOn(ormRepository, 'find')
      .mockResolvedValue([fakeCategoryEntity]);

    const result = await categoryRepository.findById(1);

    expect(result).toEqual(fakeCategoryEntity);
    expect(ormRepository.find).toBeCalled();
  });

  it('should throw FindCategoryException', async () => {
    jest
      .spyOn(ormRepository, 'find')
      .mockRejectedValue(new Error());

    await expect(categoryRepository.findById(1)).rejects.toThrow(
      new FindCategoryException(),
    );
  });

  it('should be find a category by params', async () => {
    jest
      .spyOn(ormRepository, 'find')
      .mockResolvedValue([fakeCategoryEntity]);

    const result = await categoryRepository.findByParams({
      userId: fakeUserId,
    });

    expect(result).toEqual([fakeCategoryEntity]);
    expect(ormRepository.find).toHaveBeenCalled();
  });

  it('should throw FindCategoryException when call findByParams', async () => {
    jest
      .spyOn(ormRepository, 'find')
      .mockImplementation(() => Promise.reject(new Error()));

    await expect(categoryRepository.findByParams({})).rejects.toThrow(
      new FindCategoryException(),
    );
  });

  it('should be able delete', async () => {
    jest.spyOn(ormRepository, 'delete').mockResolvedValue({} as DeleteResult);
    const result = await categoryRepository.delete(fakeCategoryEntity);
    expect(result).toEqual({ deleted: true } as CategoryDeleteResponseDTO);
  });

  it('should throw DeleteCategoryException', async () => {
    jest.spyOn(ormRepository, 'delete').mockRejectedValue(new Error());
    await expect(categoryRepository.delete(fakeCategoryEntity)).rejects.toThrow(
      new DeleteCategoryException(),
    );
  });
});
