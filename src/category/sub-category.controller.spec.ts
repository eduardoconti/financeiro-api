import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { userPayloadInterfaceMock } from '@auth/mocks';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { fakeSubCategoryEntity, fakeSubCategoryRequest } from './mocks';
import {
  IDeleteSubCategoryService,
  IGetSubCategoryService,
  IInsertSubCategoryService,
  IUpdateSubCategoryService,
} from './service/sub-category';
import { SubCategoryController } from './sub-category.controller';

describe('SubCategoryController', () => {
  let categoryController: SubCategoryController;
  let getSubCategoryService: IGetSubCategoryService;
  let insertSubCategoryService: IInsertSubCategoryService;
  let deleteSubCategoryService: IDeleteSubCategoryService;
  let updateSubCategoryService: IUpdateSubCategoryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SubCategoryController],
      providers: [
        {
          provide: TYPES.GetSubCategoryService,
          useValue: {
            getAll: jest.fn(),
            findSubCategoryUserById: jest.fn(),
            getAllSubCategories: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertSubCategoryService,
          useValue: {
            insertSubCategory: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteSubCategoryService,
          useValue: {
            deleteSubCategory: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateSubCategoryService,

          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryController = module.get<SubCategoryController>(
      SubCategoryController,
    );
    getSubCategoryService = module.get<IGetSubCategoryService>(
      TYPES.GetSubCategoryService,
    );
    insertSubCategoryService = module.get<IInsertSubCategoryService>(
      TYPES.InsertSubCategoryService,
    );
    deleteSubCategoryService = module.get<IDeleteSubCategoryService>(
      TYPES.DeleteSubCategoryService,
    );
    updateSubCategoryService = module.get<IUpdateSubCategoryService>(
      TYPES.UpdateSubCategoryService,
    );
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
    expect(getSubCategoryService).toBeDefined();
    expect(insertSubCategoryService).toBeDefined();
    expect(deleteSubCategoryService).toBeDefined();
    expect(updateSubCategoryService).toBeDefined();
  });

  it('should call getAll', async () => {
    jest
      .spyOn(getSubCategoryService, 'getAllSubCategories')
      .mockResolvedValue([fakeSubCategoryEntity]);

    const result = await categoryController.getAll(userPayloadInterfaceMock);

    expect(result.data).toEqual([fakeSubCategoryEntity]);
    expect(result).toBeInstanceOf(SuccessResponseData);
    expect(result.getStatus()).toBe(HttpStatus.OK);
  });

  it('should call getOne', async () => {
    jest
      .spyOn(getSubCategoryService, 'findSubCategoryUserById')
      .mockResolvedValue(fakeSubCategoryEntity);

    const result = await categoryController.getOne(
      fakeSubCategoryEntity.id as number,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual(fakeSubCategoryEntity);
    expect(result).toBeInstanceOf(SuccessResponseData);
    expect(result.getStatus()).toBe(HttpStatus.OK);
  });

  it('should call insert', async () => {
    jest
      .spyOn(insertSubCategoryService, 'insertSubCategory')
      .mockResolvedValue(fakeSubCategoryEntity);

    const result = await categoryController.insert(
      fakeSubCategoryRequest,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual(fakeSubCategoryEntity);
    expect(result).toBeInstanceOf(SuccessResponseData);
    expect(result.getStatus()).toBe(HttpStatus.CREATED);
  });

  it('should call delete', async () => {
    jest
      .spyOn(deleteSubCategoryService, 'deleteSubCategory')
      .mockResolvedValue({ deleted: true });

    const result = await categoryController.delete(
      fakeSubCategoryEntity.id as number,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual({ deleted: true });
    expect(result).toBeInstanceOf(SuccessResponseData);
    expect(result.getStatus()).toBe(HttpStatus.OK);
  });

  it('should call update', async () => {
    jest
      .spyOn(updateSubCategoryService, 'update')
      .mockResolvedValue(fakeSubCategoryEntity);

    const result = await categoryController.update(
      fakeSubCategoryEntity.id as number,
      fakeSubCategoryRequest,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual(fakeSubCategoryEntity);
    expect(result).toBeInstanceOf(SuccessResponseData);
    expect(result.getStatus()).toBe(HttpStatus.OK);
  });
});
