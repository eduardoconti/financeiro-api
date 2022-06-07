import { Test, TestingModule } from '@nestjs/testing';

import {
  fakeCategoryEntity,
  fakeDeletedCategoryResponse,
} from '@category/mocks';
import { ICategoryRepository } from '@category/repository';

import { TYPES } from '@config/dependency-injection';

import { DeleteCategoryService } from './delete-category.service';
import { IDeleteCategoryService } from './delete-category.service.interface';
import { IGetCategoryService } from './get-category.service.interface';

describe('DeleteCategoryService', () => {
  let service: IDeleteCategoryService;
  let categoryRepository: ICategoryRepository;
  let getCategoryService: IGetCategoryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.CategoryRepository,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: TYPES.GetCategoryService,
          useValue: {
            findCategoryUserById: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteCategoryService,
          useClass: DeleteCategoryService,
        },
      ],
    }).compile();

    service = module.get<DeleteCategoryService>(TYPES.DeleteCategoryService);
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

  it('should delete a category', async () => {
    jest
      .spyOn(categoryRepository, 'delete')
      .mockResolvedValue(fakeDeletedCategoryResponse);

    jest
      .spyOn(getCategoryService, 'findCategoryUserById')
      .mockResolvedValue(fakeCategoryEntity);
    const result = await service.deleteCategory(
      fakeCategoryEntity.id as number,
      fakeCategoryEntity.userId,
    );
    expect(result).toEqual(fakeDeletedCategoryResponse);
    expect(getCategoryService.findCategoryUserById).toBeCalled();
  });
});
