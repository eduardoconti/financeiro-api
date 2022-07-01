import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { UserDTO } from '@users/dto';
import { Users } from '@users/entity';
import { UserNotFoundException } from '@users/exception';
import { IUserRepository } from '@users/repository';

import { TYPES } from '@config/dependency-injection';

import { IGetUserService } from '.';
import { GetUserService } from './get-user.service';

const fakeUserDTO: UserDTO = new UserDTO();
fakeUserDTO.login = 'test';
fakeUserDTO.nome = 'test';
fakeUserDTO.password = 'test';
fakeUserDTO.status = 1;
fakeUserDTO.perfil = 1;

const fakeUserEntity: Users = Users.build(fakeUserDTO);
describe('GetUserService', () => {
  let getUserService: IGetUserService;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        {
          provide: TYPES.UserRepository,
          useValue: {
            findByParams: jest.fn(),
          },
        },
        {
          provide: TYPES.PasswordManagerService,
          useValue: {
            getHash: jest.fn(),
          },
        },
        {
          provide: TYPES.GetUserService,
          useClass: GetUserService,
        },
      ],
    }).compile();

    getUserService = module.get<GetUserService>(TYPES.GetUserService);
    userRepository = module.get<IUserRepository>(TYPES.UserRepository);
  });

  it('should be defined', () => {
    expect(getUserService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should be able to get all users', async () => {
    jest.spyOn(userRepository, 'findByParams').mockImplementation(() => {
      return Promise.resolve([fakeUserEntity]);
    });
    const users = await getUserService.getAll();
    expect(users).toBeDefined();
    expect(userRepository.findByParams).toHaveBeenCalledWith();
  });

  it('should be able to get user by login', async () => {
    jest.spyOn(userRepository, 'findByParams').mockImplementation(() => {
      return Promise.resolve([fakeUserEntity]);
    });
    const user = await getUserService.getUserByLogin('test');
    expect(user).toBeDefined();
    expect(user.login).toBe('test');
    expect(user).toEqual(fakeUserEntity);
  });

  it('should be able to get user by id', async () => {
    jest.spyOn(userRepository, 'findByParams').mockImplementation(() => {
      return Promise.resolve([fakeUserEntity]);
    });
    const user = await getUserService.getUserById('test');
    expect(user).toBeDefined();
    expect(user.login).toBe('test');
    expect(user).toEqual(fakeUserEntity);
  });

  it('should throw UserNotFoundException when get user by id', async () => {
    jest.spyOn(userRepository, 'findByParams').mockImplementation(() => {
      return Promise.resolve(undefined);
    });
    await expect(getUserService.getUserById('test')).rejects.toThrow(
      new UserNotFoundException('any'),
    );
  });

  it('should throw UserNotFoundException when get user by login', async () => {
    jest.spyOn(userRepository, 'findByParams').mockImplementation(() => {
      return Promise.resolve(undefined);
    });
    await expect(getUserService.getUserByLogin('test')).rejects.toThrow(
      new UserNotFoundException('any'),
    );
  });
});
