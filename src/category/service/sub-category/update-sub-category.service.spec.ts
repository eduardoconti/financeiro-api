import { Test, TestingModule } from '@nestjs/testing';

import { fakeSubCategoryEntity, fakeSubCategoryRequest } from '@category/mocks';
import { ISubCategoryRepository } from '@category/repository/sub-category';

import { TYPES } from '@config/dependency-injection';

import { IGetSubCategoryService } from './get-sub-category.service.interface';
import { UpdateSubCategoryService } from './update-sub-category.service';
import { IUpdateSubCategoryService } from './update-sub-category.service.interface';

describe('UpdateSubCategoryService', () => {
  let service: IUpdateSubCategoryService;
  let repository: ISubCategoryRepository;
  let getSubCategoryService: IGetSubCategoryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.SubCategoryRepository,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: TYPES.GetSubCategoryService,
          useValue: {
            findSubCategoryUserById: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateSubCategoryService,
          useClass: UpdateSubCategoryService,
        },
      ],
    }).compile();

    service = module.get<UpdateSubCategoryService>(
      TYPES.UpdateSubCategoryService,
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

  it('should update a sub category', async () => {
    jest.spyOn(repository, 'update').mockResolvedValue(fakeSubCategoryEntity);

    jest
      .spyOn(getSubCategoryService, 'findSubCategoryUserById')
      .mockResolvedValue(fakeSubCategoryEntity);
    const result = await service.update(
      fakeSubCategoryEntity.id as number,
      fakeSubCategoryEntity.userId,
      fakeSubCategoryRequest,
    );
    expect(result).toEqual(fakeSubCategoryEntity);
    expect(getSubCategoryService.findSubCategoryUserById).toBeCalled();
  });
});
