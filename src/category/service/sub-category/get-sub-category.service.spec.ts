import { Test } from '@nestjs/testing';

import {
  ForbiddenSubCategoryException,
  SubCategoryNotFoundException,
} from '@category/exception/sub-category';
import { fakeSubCategoryEntity } from '@category/mocks';
import { ISubCategoryRepository } from '@category/repository/sub-category';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';

import { GetSubCategoryService } from './get-sub-category.service';
import { IGetSubCategoryService } from './get-sub-category.service.interface';

const categoryRepositoryMocked = {
  findByParams: jest.fn(),
  findById: jest.fn(),
};
describe('GetSubCategoryService', () => {
  let categoryService: IGetSubCategoryService;
  let repository: ISubCategoryRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.SubCategoryRepository,
          useValue: categoryRepositoryMocked,
        },
        {
          provide: TYPES.GetSubCategoryService,
          useClass: GetSubCategoryService,
        },
      ],
    }).compile();

    categoryService = moduleRef.get<IGetSubCategoryService>(
      TYPES.GetSubCategoryService,
    );
    repository = moduleRef.get<ISubCategoryRepository>(
      TYPES.SubCategoryRepository,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('should return SubCategoryNotFoundException when call findById', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(() => categoryService.findById(1)).rejects.toThrowError(
      SubCategoryNotFoundException,
    );
  });

  it('should call findById', async () => {
    (repository.findById as jest.Mock).mockResolvedValue(fakeSubCategoryEntity);
    const result = await categoryService.findById(1);

    expect(result).toEqual(fakeSubCategoryEntity);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('should return SubCategoryNotFoundException when call findSubCategoryUserById', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(() =>
      categoryService.findSubCategoryUserById(1, fakeUserId),
    ).rejects.toThrowError(SubCategoryNotFoundException);
    expect(repository.findById).toBeCalledWith(1);
  });

  it('should return ForbiddenSubCategoryException when call findSubCategoryUserById', async () => {
    jest
      .spyOn(repository, 'findById')
      .mockResolvedValue({ ...fakeSubCategoryEntity, userId: '123' });

    await expect(() =>
      categoryService.findSubCategoryUserById(1, fakeUserId),
    ).rejects.toThrowError(ForbiddenSubCategoryException);
    expect(repository.findById).toBeCalledWith(1);
  });

  it('should call findSubCategoryUserById', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(fakeSubCategoryEntity);

    const result = await categoryService.findSubCategoryUserById(1, fakeUserId);

    expect(result).toEqual(fakeSubCategoryEntity);
  });

  it('should call getAllCategories', async () => {
    jest
      .spyOn(repository, 'findByParams')
      .mockResolvedValue([fakeSubCategoryEntity]);

    const result = await categoryService.getAllSubCategories({
      userId: fakeUserId,
    });

    expect(result).toEqual([fakeSubCategoryEntity]);
  });

  it('should throw SubCategoryNotFoundException when call getAllCategories', async () => {
    jest.spyOn(repository, 'findByParams').mockResolvedValue(null);
    await expect(
      categoryService.getAllSubCategories({ userId: fakeUserId }),
    ).rejects.toThrowError(SubCategoryNotFoundException);
  });
});
