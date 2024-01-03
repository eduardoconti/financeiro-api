import { Test } from '@nestjs/testing';

import {
  CategoryNotFoundException,
  ForbiddenCategoryException,
} from '@category/exception';
import { fakeCategoryEntity } from '@category/mocks';
import { ICategoryRepository } from '@category/repository';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';

import { GetCategoryService } from './get-category.service';
import { IGetCategoryService } from './get-category.service.interface';

const categoryRepositoryMocked = {
  findByParams: jest.fn(),
  findById: jest.fn(),
};
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

  it('should return CategoryNotFoundException when call findById', async () => {
    jest.spyOn(categoryRepository, 'findById').mockResolvedValue(null);

    await expect(() => categoryService.findById(1)).rejects.toThrowError(
      CategoryNotFoundException,
    );
  });

  it('should call findById', async () => {
    (categoryRepository.findById as jest.Mock).mockResolvedValue(
      fakeCategoryEntity,
    );
    const result = await categoryService.findById(1);

    expect(result).toEqual(fakeCategoryEntity);
    expect(categoryRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should return CategoryNotFoundException when call findCategoryUserById', async () => {
    jest.spyOn(categoryRepository, 'findById').mockResolvedValue(null);

    await expect(() =>
      categoryService.findOne(1, fakeUserId),
    ).rejects.toThrowError(CategoryNotFoundException);
    expect(categoryRepository.findById).toBeCalledWith(1);
  });

  it('should return ForbiddenCategoryException when call findCategoryUserById', async () => {
    jest
      .spyOn(categoryRepository, 'findById')
      .mockResolvedValue({ ...fakeCategoryEntity, userId: '123' });

    await expect(() =>
      categoryService.findOne(1, fakeUserId),
    ).rejects.toThrowError(ForbiddenCategoryException);
    expect(categoryRepository.findById).toBeCalledWith(1);
  });

  it('should call findCategoryUserById', async () => {
    jest
      .spyOn(categoryRepository, 'findById')
      .mockResolvedValue(fakeCategoryEntity);

    const result = await categoryService.findOne(1, fakeUserId);

    expect(result).toEqual(fakeCategoryEntity);
  });

  it('should call getAllCategories', async () => {
    jest
      .spyOn(categoryRepository, 'findByParams')
      .mockResolvedValue([fakeCategoryEntity]);

    const result = await categoryService.getAllCategories(fakeUserId);

    expect(result).toEqual([fakeCategoryEntity]);
  });

  it('should throw CategoryNotFoundException when call getAllCategories', async () => {
    jest.spyOn(categoryRepository, 'findByParams').mockResolvedValue(null);
    await expect(
      categoryService.getAllCategories(fakeUserId),
    ).rejects.toThrowError(CategoryNotFoundException);
  });
});
