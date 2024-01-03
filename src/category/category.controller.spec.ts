import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { userPayloadInterfaceMock } from '@auth/mocks';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { CategoryController } from './category.controller';
import { fakeCategoryEntity, fakeCategoryRequest } from './mocks';
import {
  IDeleteCategoryService,
  IGetCategoryService,
  IInsertCategoryService,
  IUpdateCategoryService,
} from './service';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let getCategoryService: IGetCategoryService;
  let insertCategoryService: IInsertCategoryService;
  let deleteCategoryService: IDeleteCategoryService;
  let updateCategoryService: IUpdateCategoryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: TYPES.GetCategoryService,
          useValue: {
            getAll: jest.fn(),
            findOne: jest.fn(),
            getAllCategories: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertCategoryService,
          useValue: {
            insertCategory: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteCategoryService,
          useValue: {
            deleteCategory: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateCategoryService,

          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    getCategoryService = module.get<IGetCategoryService>(
      TYPES.GetCategoryService,
    );
    insertCategoryService = module.get<IInsertCategoryService>(
      TYPES.InsertCategoryService,
    );
    deleteCategoryService = module.get<IDeleteCategoryService>(
      TYPES.DeleteCategoryService,
    );
    updateCategoryService = module.get<IUpdateCategoryService>(
      TYPES.UpdateCategoryService,
    );
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
    expect(getCategoryService).toBeDefined();
    expect(insertCategoryService).toBeDefined();
    expect(deleteCategoryService).toBeDefined();
    expect(updateCategoryService).toBeDefined();
  });

  it('should call getAll', async () => {
    jest
      .spyOn(getCategoryService, 'getAllCategories')
      .mockResolvedValue([fakeCategoryEntity]);

    const result = await categoryController.getAll(userPayloadInterfaceMock);

    expect(result.data).toEqual([fakeCategoryEntity]);
    expect(result).toBeInstanceOf(SuccessResponseData);
    expect(result.getStatus()).toBe(HttpStatus.OK);
  });

  it('should call getOne', async () => {
    jest
      .spyOn(getCategoryService, 'findOne')
      .mockResolvedValue(fakeCategoryEntity);

    const result = await categoryController.getOne(
      fakeCategoryEntity.id as number,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual(fakeCategoryEntity);
    expect(result).toBeInstanceOf(SuccessResponseData);
    expect(result.getStatus()).toBe(HttpStatus.OK);
  });

  it('should call insert', async () => {
    jest
      .spyOn(insertCategoryService, 'insertCategory')
      .mockResolvedValue(fakeCategoryEntity);

    const result = await categoryController.insert(
      fakeCategoryRequest,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual(fakeCategoryEntity);
    expect(result).toBeInstanceOf(SuccessResponseData);
    expect(result.getStatus()).toBe(HttpStatus.CREATED);
  });

  it('should call delete', async () => {
    jest
      .spyOn(deleteCategoryService, 'deleteCategory')
      .mockResolvedValue({ deleted: true });

    const result = await categoryController.delete(
      fakeCategoryEntity.id as number,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual({ deleted: true });
    expect(result).toBeInstanceOf(SuccessResponseData);
    expect(result.getStatus()).toBe(HttpStatus.OK);
  });

  it('should call update', async () => {
    jest
      .spyOn(updateCategoryService, 'update')
      .mockResolvedValue(fakeCategoryEntity);

    const result = await categoryController.update(
      fakeCategoryEntity.id as number,
      fakeCategoryRequest,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual(fakeCategoryEntity);
    expect(result).toBeInstanceOf(SuccessResponseData);
    expect(result.getStatus()).toBe(HttpStatus.OK);
  });
});
