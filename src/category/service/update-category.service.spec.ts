import { Test, TestingModule } from '@nestjs/testing';

import { fakeCategoryEntity, fakeCategoryRequest } from '@category/mocks';
import { ICategoryRepository } from '@category/repository';

import { TYPES } from '@config/dependency-injection';

import { IGetCategoryService } from './get-category.service.interface';
import { UpdateCategoryService } from './update-category.service';
import { IUpdateCategoryService } from './update-category.service.interface';

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
            findOne: jest.fn(),
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
      .spyOn(getCategoryService, 'findOne')
      .mockResolvedValue(fakeCategoryEntity);
    const result = await service.update(
      fakeCategoryEntity.id as number,
      fakeCategoryEntity.userId,
      fakeCategoryRequest,
    );
    expect(result).toEqual(fakeCategoryEntity);
    expect(getCategoryService.findOne).toBeCalled();
  });
});
