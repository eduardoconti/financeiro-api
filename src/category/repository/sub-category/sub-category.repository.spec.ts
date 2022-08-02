import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubCategoryDeleteResponseDTO } from '@category/dto/sub-category';
import { SubCategory } from '@category/entity';
import {
  DeleteSubCategoryException,
  FindSubCategoryException,
  InsertSubCategoryException,
  UpdateSubCategoryException,
} from '@category/exception/sub-category';
import { fakeSubCategoryEntity } from '@category/mocks';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';

import { SubCategoryRepository } from './sub-category.repository';
import { ISubCategoryRepository } from './sub-category.repository.interface';

describe('SubCategoryRepository', () => {
  let ormRepository: Repository<SubCategory>;
  let categoryRepository: ISubCategoryRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.SubCategoryRepository,
          useClass: SubCategoryRepository,
        },
        {
          provide: getRepositoryToken(SubCategory),
          useClass: Repository,
        },
      ],
    }).compile();
    categoryRepository = module.get<ISubCategoryRepository>(
      TYPES.SubCategoryRepository,
    );
    ormRepository = module.get(getRepositoryToken(SubCategory));
  });

  it('should be defined', () => {
    expect(categoryRepository).toBeDefined();
    expect(ormRepository).toBeDefined();
  });

  it('should be insert a sub category', async () => {
    jest
      .spyOn(ormRepository, 'create')
      .mockImplementation(() => fakeSubCategoryEntity);
    jest
      .spyOn(ormRepository, 'save')
      .mockImplementation(() => Promise.resolve(fakeSubCategoryEntity));
    const result = await categoryRepository.insert(fakeSubCategoryEntity);

    expect(result).toEqual(fakeSubCategoryEntity);
    expect(ormRepository.create).toHaveBeenCalledWith(fakeSubCategoryEntity);
  });

  it('should throw InsertSubCategoryException', async () => {
    jest
      .spyOn(ormRepository, 'create')
      .mockImplementation(() => fakeSubCategoryEntity);
    jest
      .spyOn(ormRepository, 'save')
      .mockImplementation(() => Promise.reject(new Error()));

    await expect(
      categoryRepository.insert(fakeSubCategoryEntity),
    ).rejects.toThrow(new InsertSubCategoryException());
  });

  it('should be update a sub category', async () => {
    jest
      .spyOn(ormRepository, 'save')
      .mockImplementation(() => Promise.resolve(fakeSubCategoryEntity));

    const result = await categoryRepository.update(fakeSubCategoryEntity);

    expect(result).toEqual(fakeSubCategoryEntity);
    expect(ormRepository.save).toHaveBeenCalledWith(fakeSubCategoryEntity);
  });

  it('should throw UpdateSubCategoryException', async () => {
    jest
      .spyOn(ormRepository, 'save')
      .mockImplementation(() => Promise.reject(new Error()));

    await expect(
      categoryRepository.update(fakeSubCategoryEntity),
    ).rejects.toThrow(new UpdateSubCategoryException());
  });

  it('should be find a sub category by id', async () => {
    jest
      .spyOn(ormRepository, 'findOne')
      .mockImplementation(() => Promise.resolve(fakeSubCategoryEntity));

    const result = await categoryRepository.findById(1);

    expect(result).toEqual(fakeSubCategoryEntity);
    expect(ormRepository.findOne).toHaveBeenCalled();
  });

  it('should throw FindSubCategoryException', async () => {
    jest
      .spyOn(ormRepository, 'findOne')
      .mockImplementation(() => Promise.reject(new Error()));

    await expect(categoryRepository.findById(1)).rejects.toThrow(
      new FindSubCategoryException(),
    );
  });

  it('should be find a sub category by params', async () => {
    jest
      .spyOn(ormRepository, 'find')
      .mockImplementation(() => Promise.resolve([fakeSubCategoryEntity]));

    const result = await categoryRepository.findByParams({
      userId: fakeUserId,
    });

    expect(result).toEqual([fakeSubCategoryEntity]);
    expect(ormRepository.find).toHaveBeenCalled();
  });

  it('should throw FindSubCategoryException when call findByParams', async () => {
    jest
      .spyOn(ormRepository, 'find')
      .mockImplementation(() => Promise.reject(new Error()));

    await expect(categoryRepository.findByParams({})).rejects.toThrow(
      new FindSubCategoryException(),
    );
  });

  it('should be able delete', async () => {
    jest
      .spyOn(ormRepository, 'remove')
      .mockResolvedValue(fakeSubCategoryEntity);
    const result = await categoryRepository.delete(fakeSubCategoryEntity);
    expect(result).toEqual({ deleted: true } as SubCategoryDeleteResponseDTO);
  });

  it('should throw DeleteSubCategoryException', async () => {
    jest.spyOn(ormRepository, 'remove').mockRejectedValue(new Error());
    await expect(
      categoryRepository.delete(fakeSubCategoryEntity),
    ).rejects.toThrow(new DeleteSubCategoryException());
  });
});
