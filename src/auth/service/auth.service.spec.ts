import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserPayloadDto } from '@auth/dto';

import { UserDTO } from '@users/dto';
import { Users } from '@users/entity';
import { IGetUserService, IPasswordManagerService } from '@users/service';

import { TYPES } from '@config/dependency-injection';

import { AuthService } from './auth.service';
import { IAuthService } from './auth.service.interface';

const fakeUserDTO: UserDTO = new UserDTO();
fakeUserDTO.login = 'test';
fakeUserDTO.nome = 'test';
fakeUserDTO.password = 'test';
fakeUserDTO.status = 1;
fakeUserDTO.perfil = 1;

const fakeUserEntity: Users = Users.build(fakeUserDTO);

const fakeUserPayloadDto: UserPayloadDto = new UserPayloadDto(fakeUserEntity);
describe('AuthService', () => {
  let authService: IAuthService;
  let getUserService: IGetUserService;
  let passwordManager: IPasswordManagerService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.GetUserService,
          useValue: {
            getUserByLogin: jest.fn(),
          },
        },
        {
          provide: TYPES.PasswordManagerService,
          useValue: {
            compareHash: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: TYPES.AuthService,
          useClass: AuthService,
        },
      ],
    }).compile();

    authService = module.get<IAuthService>(TYPES.AuthService);
    getUserService = module.get<IGetUserService>(TYPES.GetUserService);
    passwordManager = module.get<IPasswordManagerService>(
      TYPES.PasswordManagerService,
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(getUserService).toBeDefined();
    expect(passwordManager).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should be able to login', async () => {
    jest
      .spyOn(jwtService, 'signAsync')
      .mockImplementation(() => Promise.resolve('token'));

    const result = await authService.login(fakeUserPayloadDto);

    expect(result).toBeDefined();
  });

  it('should validateUser', async () => {
    jest.spyOn(getUserService, 'getUserByLogin').mockImplementation(() => {
      return Promise.resolve(fakeUserEntity);
    });
    jest.spyOn(passwordManager, 'compareHash').mockImplementation(() => {
      return Promise.resolve(true);
    });

    const result = await authService.validateUser('teste', 'teste');

    expect(result).toBeDefined();
  });
});
