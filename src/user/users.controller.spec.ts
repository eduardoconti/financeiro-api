import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { UserDeleteResponseDTO } from './dto';
import { userEntityMock, userRequest } from './mocks';
import {
  IDeleteUserService,
  IGetUserService,
  IInsertUserService,
} from './service';
import { UsersController } from './users.controller';

describe('UserController', () => {
  let controller: UsersController;
  let insertUserService: IInsertUserService;
  let deleteUserService: IDeleteUserService;
  let getUserService: IGetUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: TYPES.InsertUserService,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteUserService,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: TYPES.GetUserService,
          useValue: {
            getAll: jest.fn(),
            getUserByLogin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    insertUserService = module.get<IInsertUserService>(TYPES.InsertUserService);
    deleteUserService = module.get<IDeleteUserService>(TYPES.DeleteUserService);
    getUserService = module.get<IGetUserService>(TYPES.GetUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(insertUserService).toBeDefined();
    expect(deleteUserService).toBeDefined();
    expect(getUserService).toBeDefined();
  });

  it('should get all users', async () => {
    jest.spyOn(getUserService, 'getAll').mockResolvedValue([userEntityMock]);
    const result = await controller.getAllUsers();
    expect(result.data).toEqual([userEntityMock]);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
    expect(result).toBeInstanceOf(SuccessResponseData);
  });

  it('should get user by login', async () => {
    jest
      .spyOn(getUserService, 'getUserByLogin')
      .mockResolvedValue(userEntityMock);
    const result = await controller.getUserByLogin('login');
    expect(result.data).toEqual(userEntityMock);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
    expect(result).toBeInstanceOf(SuccessResponseData);
  });

  it('should insert user', async () => {
    jest.spyOn(insertUserService, 'insert').mockResolvedValue(userEntityMock);
    const result = await controller.createUser(userRequest);
    expect(result.data).toEqual(userEntityMock);
    expect(result.getStatus()).toEqual(HttpStatus.CREATED);
    expect(result).toBeInstanceOf(SuccessResponseData);
  });

  it('should delete user', async () => {
    jest
      .spyOn(deleteUserService, 'delete')
      .mockResolvedValue(new UserDeleteResponseDTO(true));
    const result = await controller.deleteUser('login');
    expect(result.data).toBeInstanceOf(UserDeleteResponseDTO);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
    expect(result).toBeInstanceOf(SuccessResponseData);
  });
});
