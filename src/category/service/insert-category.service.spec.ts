import { Test, TestingModule } from '@nestjs/testing';

import { fakeCategoryEntity, fakeCategoryRequest } from '@category/mocks';
import { ICategoryRepository } from '@category/repository';

import { TYPES } from '@config/dependency-injection';

import { InsertCategoryService } from './insert-category.service';

describe('InsertCategoryService', () => {
  let service: InsertCategoryService;
  let categoryRepository: ICategoryRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.CategoryRepository,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertCategoryService,
          useClass: InsertCategoryService,
        },
      ],
    }).compile();

    service = module.get<InsertCategoryService>(TYPES.InsertCategoryService);
    categoryRepository = module.get<ICategoryRepository>(
      TYPES.CategoryRepository,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  it('should insert a category', async () => {
    jest
      .spyOn(categoryRepository, 'insert')
      .mockResolvedValue(fakeCategoryEntity);
    const result = await service.insertCategory(
      fakeCategoryRequest,
      fakeCategoryEntity.userId,
    );
    expect(result).toEqual(fakeCategoryEntity);
  });
});
