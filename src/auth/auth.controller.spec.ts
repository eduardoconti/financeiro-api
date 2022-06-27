import { Test } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { AuthController } from './auth.controller';
import { singDtoMock, userPayloadInterfaceMock } from './mocks';
import { IAuthService } from './service';
import { SuccessResponseData } from '@shared/dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: IAuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: TYPES.AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<IAuthService>(TYPES.AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should call login', async () => {
    jest.spyOn(authService, 'login').mockResolvedValue(singDtoMock);

    const result = await authController.login(userPayloadInterfaceMock);

    expect(result.data).toEqual(singDtoMock);
    expect(result).toBeInstanceOf(SuccessResponseData);
  });
});
