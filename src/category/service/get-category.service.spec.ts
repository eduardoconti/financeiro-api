/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';

import { Category } from '@category/entity';
import {
  CategoryNotFoundException,
  FindCategoryException,
  ForbiddenCategoryException,
} from '@category/exception';
import { ICategoryRepository } from '@category/repository';

import { TYPES } from '@config/dependency-injection';

import { GetCategoryService } from './get-category.service';
import { IGetCategoryService } from './get-category.service.interface';

const categoryRepositoryMocked = {
  findAll: jest.fn(),
  findById: jest.fn(),
};

const fakeUserId = '37f5c664-274f-47b2-811b-e3cdd093f27f';
const fakeCategoryId = 1;
const fakeCategory = Category.build({
  id: fakeCategoryId,
  descricao: 'Fake Category',
  userId: fakeUserId,
});
describe('GetCategoryService', () => {
  let categoryService: IGetCategoryService;
  let categoryRepository: ICategoryRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.CategoryRepository,
          useValue: categoryRepositoryMocked,
        },
        {
          provide: TYPES.GetCategoryService,
          useClass: GetCategoryService,
        },
      ],
    }).compile();

    categoryService = moduleRef.get<IGetCategoryService>(
      TYPES.GetCategoryService,
    );
    categoryRepository = moduleRef.get<ICategoryRepository>(
      TYPES.CategoryRepository,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(categoryRepository).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  describe('GetAllCategories', () => {
    it('should return FindCategoryException when there is an unknown error', async (done) => {
      (categoryRepository.findAll as jest.Mock).mockRejectedValue(
        new FindCategoryException(),
      );

      await expect(() =>
        categoryService.getAllCategories(fakeUserId),
      ).rejects.toThrowError(FindCategoryException);

      done();
    });

    it('should return an array of categories if successfully', async () => {
      (categoryRepository.findAll as jest.Mock).mockResolvedValue([
        fakeCategory,
      ]);

      const result = await categoryService.getAllCategories(fakeUserId);

      expect(result).toEqual([fakeCategory]);
      expect(categoryRepository.findAll).toHaveBeenCalledWith(fakeUserId);
    });
  });

  describe('FindById', () => {
    it('should return FindCategoryException when there is an unknown error', async (done) => {
      (categoryRepository.findById as jest.Mock).mockRejectedValue(
        new FindCategoryException(),
      );

      await expect(() =>
        categoryService.findById(fakeCategoryId),
      ).rejects.toThrowError(FindCategoryException);

      done();
    });

    it('should return CategoryNotFoundException when there is an unknown error', async (done) => {
      (categoryRepository.findById as jest.Mock).mockResolvedValue(undefined);

      expect.assertions(2);
      await expect(() =>
        categoryService.findById(fakeCategoryId),
      ).rejects.toThrowError(CategoryNotFoundException);
      expect(categoryRepository.findById).toBeCalledWith(fakeCategoryId);

      done();
    });

    it('should return category if successfully', async () => {
      (categoryRepository.findById as jest.Mock).mockResolvedValue(
        fakeCategory,
      );
      const result = await categoryService.findById(fakeCategoryId);

      expect(result).toEqual(fakeCategory);
      expect(categoryRepository.findById).toHaveBeenCalledWith(fakeCategoryId);
    });
  });

  describe('FindCategoryUserById', () => {
    it('should return FindCategoryException when there is an unknown error', async (done) => {
      (categoryRepository.findById as jest.Mock).mockRejectedValue(
        new FindCategoryException(),
      );

      expect.assertions(2);
      await expect(() =>
        categoryService.findCategoryUserById(fakeCategoryId, fakeUserId),
      ).rejects.toThrowError(FindCategoryException);
      expect(categoryRepository.findById).toBeCalledWith(fakeCategoryId);

      done();
    });

    it('should return CategoryNotFound when not found category', async (done) => {
      (categoryRepository.findById as jest.Mock).mockResolvedValue(undefined);

      expect.assertions(2);
      await expect(() =>
        categoryService.findCategoryUserById(fakeCategoryId, fakeUserId),
      ).rejects.toThrowError(CategoryNotFoundException);
      expect(categoryRepository.findById).toBeCalledWith(fakeCategoryId);

      done();
    });

    it('should return ForbiddenCategoryException when category not percente to user', async (done) => {
      (categoryRepository.findById as jest.Mock).mockResolvedValue(
        fakeCategory,
      );

      expect.assertions(2);
      await expect(() =>
        categoryService.findCategoryUserById(fakeCategoryId, '123'),
      ).rejects.toThrowError(ForbiddenCategoryException);
      expect(categoryRepository.findById).toBeCalledWith(fakeCategoryId);

      done();
    });

    it('should return user category if successfully', async () => {
      (categoryRepository.findById as jest.Mock).mockResolvedValue(
        fakeCategory,
      );
      const result = await categoryService.findCategoryUserById(
        fakeCategoryId,
        fakeUserId,
      );

      expect(result).toEqual(fakeCategory);
      expect(categoryRepository.findById).toBeCalledWith(fakeCategoryId);
    });
  });
});
