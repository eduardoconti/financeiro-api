import { Test, TestingModule } from '@nestjs/testing';

import {
  fakeSubCategoryEntity,
  fakeDeletedSubCategoryResponse,
} from '@category/mocks';
import { ISubCategoryRepository } from '@category/repository/sub-category';

import { TYPES } from '@config/dependency-injection';

import { DeleteSubCategoryService } from './delete-sub-category.service';
import { IDeleteSubCategoryService } from './delete-sub-category.service.interface';
import { IGetSubCategoryService } from './get-sub-category.service.interface';

describe('DeleteSubCategoryService', () => {
  let service: IDeleteSubCategoryService;
  let repository: ISubCategoryRepository;
  let getSubCategoryService: IGetSubCategoryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.SubCategoryRepository,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: TYPES.GetSubCategoryService,
          useValue: {
            findSubCategoryUserById: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteSubCategoryService,
          useClass: DeleteSubCategoryService,
        },
      ],
    }).compile();

    service = module.get<DeleteSubCategoryService>(
      TYPES.DeleteSubCategoryService,
    );
    repository = module.get<ISubCategoryRepository>(
      TYPES.SubCategoryRepository,
    );
    getSubCategoryService = module.get<IGetSubCategoryService>(
      TYPES.GetSubCategoryService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(getSubCategoryService).toBeDefined();
  });

  it('should delete a sub category', async () => {
    jest
      .spyOn(repository, 'delete')
      .mockResolvedValue(fakeDeletedSubCategoryResponse);

    jest
      .spyOn(getSubCategoryService, 'findSubCategoryUserById')
      .mockResolvedValue(fakeSubCategoryEntity);
    const result = await service.deleteSubCategory(
      fakeSubCategoryEntity.id as number,
      fakeSubCategoryEntity.userId,
    );
    expect(result).toEqual(fakeDeletedSubCategoryResponse);
    expect(getSubCategoryService.findSubCategoryUserById).toBeCalled();
  });
});
