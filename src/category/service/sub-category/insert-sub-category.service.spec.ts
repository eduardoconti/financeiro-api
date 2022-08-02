import { Test, TestingModule } from '@nestjs/testing';

import { fakeSubCategoryEntity, fakeSubCategoryRequest } from '@category/mocks';
import { ISubCategoryRepository } from '@category/repository/sub-category';

import { TYPES } from '@config/dependency-injection';

import { InsertSubCategoryService } from './insert-sub-category.service';

describe('InsertSubCategoryService', () => {
  let service: InsertSubCategoryService;
  let repository: ISubCategoryRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.SubCategoryRepository,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertSubCategoryService,
          useClass: InsertSubCategoryService,
        },
      ],
    }).compile();

    service = module.get<InsertSubCategoryService>(
      TYPES.InsertSubCategoryService,
    );
    repository = module.get<ISubCategoryRepository>(
      TYPES.SubCategoryRepository,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should insert a sub category', async () => {
    jest.spyOn(repository, 'insert').mockResolvedValue(fakeSubCategoryEntity);
    const result = await service.insertSubCategory(
      fakeSubCategoryRequest,
      fakeSubCategoryEntity.userId,
    );
    expect(result).toEqual(fakeSubCategoryEntity);
  });
});
