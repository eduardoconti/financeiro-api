import { Test, TestingModule } from '@nestjs/testing';

import { fakeCategoryEntity, fakeCategoryRequest } from '@category/mocks';
import { ICategoryRepository } from '@category/repository';

import { TYPES } from '@config/dependency-injection';

import { IGetCategoryService } from './get-category.service.interface';
import { UpdateCategoryService } from './update-category.service';
import { IUpdateCategoryService } from './update-category.service.interface';
import { CategoryNotFoundException } from '@category/exception';

describe('UpdateCategoryService', () => {
  let service: IUpdateCategoryService;
  let categoryRepository: ICategoryRepository;
  let getCategoryService: IGetCategoryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.CategoryRepository,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: TYPES.GetCategoryService,
          useValue: {
            findCategoryUserById: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateCategoryService,
          useClass: UpdateCategoryService,
        },
      ],
    }).compile();

    service = module.get<UpdateCategoryService>(TYPES.UpdateCategoryService);
    categoryRepository = module.get<ICategoryRepository>(
      TYPES.CategoryRepository,
    );
    getCategoryService = module.get<IGetCategoryService>(
      TYPES.GetCategoryService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(getCategoryService).toBeDefined();
  });

  it('should update a category', async () => {
    jest
      .spyOn(categoryRepository, 'update')
      .mockResolvedValue(fakeCategoryEntity);

    jest
      .spyOn(getCategoryService, 'findCategoryUserById')
      .mockResolvedValue(fakeCategoryEntity);
    const result = await service.update(
      fakeCategoryEntity.id as number,
      fakeCategoryEntity.userId,
      fakeCategoryRequest,
    );
    expect(result).toEqual(fakeCategoryEntity);
    expect(getCategoryService.findCategoryUserById).toBeCalled();
  });

  it('should throw CategoryNotFoundException when update repository returns null', async () => {
    jest.spyOn(categoryRepository, 'update').mockResolvedValue(null);

    jest
      .spyOn(getCategoryService, 'findCategoryUserById')
      .mockResolvedValue(fakeCategoryEntity);
    await expect(
      service.update(
        fakeCategoryEntity.id as number,
        fakeCategoryEntity.userId,
        fakeCategoryRequest,
      ),
    ).rejects.toThrowError(
      new CategoryNotFoundException(null, fakeCategoryRequest),
    );
  });
});
