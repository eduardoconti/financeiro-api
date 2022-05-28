import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { UserDTO } from '@users/dto';
import { Users } from '@users/entity';
import {
  GetUserException,
  InsertUserException,
  UserLoginAlreadyExistsException,
} from '@users/exception';
import { IUserRepository } from '@users/repository';

import { TYPES } from '@config/dependency-injection';
import { InternalServerErrorException } from '@config/exceptions';

import { InsertUserService } from './insert-user.service';
import { IInsertUserService } from './insert-user.service.interface';
import { IPasswordManagerService } from './password-mannager.service.interface';

const fakeUserDTO: UserDTO = new UserDTO();
fakeUserDTO.login = 'test';
fakeUserDTO.nome = 'test';
fakeUserDTO.password = 'test';
fakeUserDTO.status = 1;
fakeUserDTO.perfil = 1;

const fakeUserEntity: Users = Users.build(fakeUserDTO);

describe('InsertUserService', () => {
  let insertUserService: IInsertUserService;
  let passwordManagerService: IPasswordManagerService;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        {
          provide: TYPES.UserRepository,
          useValue: {
            findOneByParams: jest.fn(),
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.PasswordManagerService,
          useValue: {
            getHash: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertUserService,
          useClass: InsertUserService,
        },
      ],
    }).compile();

    insertUserService = module.get<IInsertUserService>(TYPES.InsertUserService);

    passwordManagerService = module.get<IPasswordManagerService>(
      TYPES.PasswordManagerService,
    );
    userRepository = module.get<IUserRepository>(TYPES.UserRepository);
  });
  it('should be defined', () => {
    expect(insertUserService).toBeDefined();
    expect(passwordManagerService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should insert user', async () => {
    jest
      .spyOn(passwordManagerService, 'getHash')
      .mockImplementation(() => Promise.resolve('test'));
    jest
      .spyOn(userRepository, 'findOneByParams')
      .mockImplementation(() => Promise.resolve(null));
    jest
      .spyOn(userRepository, 'insert')
      .mockImplementation(() => Promise.resolve(fakeUserEntity));

    const result: Users = await insertUserService.insert(fakeUserDTO);
    expect(result).toEqual(fakeUserEntity);
  });

  it('should throw UserLoginAlreadyExistsException', async () => {
    jest
      .spyOn(passwordManagerService, 'getHash')
      .mockImplementation(() => Promise.resolve('test'));
    jest
      .spyOn(userRepository, 'findOneByParams')
      .mockImplementation(() => Promise.resolve(fakeUserEntity));

    await expect(insertUserService.insert(fakeUserDTO)).rejects.toThrow(
      UserLoginAlreadyExistsException,
    );
  });

  it('should throw passwordManagerService.getHash error', async () => {
    jest
      .spyOn(passwordManagerService, 'getHash')
      .mockImplementation(() =>
        Promise.reject(new InternalServerErrorException()),
      );
    jest
      .spyOn(userRepository, 'findOneByParams')
      .mockImplementation(() => Promise.resolve(null));

    await expect(insertUserService.insert(fakeUserDTO)).rejects.toThrow(
      new InternalServerErrorException(),
    );
  });

  it('should throw userRepository.findOneByParams error', async () => {
    jest
      .spyOn(passwordManagerService, 'getHash')
      .mockImplementation(() => Promise.resolve('test'));
    jest
      .spyOn(userRepository, 'findOneByParams')
      .mockImplementation(() => Promise.reject(new GetUserException('any')));

    await expect(insertUserService.insert(fakeUserDTO)).rejects.toThrow(
      new GetUserException('any'),
    );
  });

  it('should throw userRepository.insert error', async () => {
    jest
      .spyOn(passwordManagerService, 'getHash')
      .mockImplementation(() => Promise.resolve('test'));
    jest
      .spyOn(userRepository, 'findOneByParams')
      .mockImplementation(() => Promise.resolve(null));
    jest
      .spyOn(userRepository, 'insert')
      .mockImplementation(() => Promise.reject(new InsertUserException('any')));

    await expect(insertUserService.insert(fakeUserDTO)).rejects.toThrow(
      new InsertUserException('any'),
    );
  });
});
