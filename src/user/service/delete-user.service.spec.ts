import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { UserDeleteResponseDTO } from '@users/dto';
import { userEntityMock } from '@users/mocks';
import { IUserRepository } from '@users/repository';

import { TYPES } from '@config/dependency-injection';

import { DeleteUserService } from './delete-user.service';
import { IDeleteUserService } from './delete-user.service.interface';
import { IGetUserService } from './get-user.service.interface';

const fakeUserDeleteResponseDTO = new UserDeleteResponseDTO(true);
const fakeId = '6fdeff33-a45d-4e51-b6f0-b7e695f72089';
describe('DeleteUserService', () => {
  let deleteUserService: IDeleteUserService;
  let userRepository: IUserRepository;
  let getUserService: IGetUserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        {
          provide: TYPES.UserRepository,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: TYPES.GetUserService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteUserService,
          useClass: DeleteUserService,
        },
      ],
    }).compile();

    deleteUserService = module.get<IDeleteUserService>(TYPES.DeleteUserService);
    userRepository = module.get<IUserRepository>(TYPES.UserRepository);
    getUserService = module.get<IGetUserService>(TYPES.GetUserService);
  });

  it('should be defined', () => {
    expect(deleteUserService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(getUserService).toBeDefined();
  });

  it('should delete user', async () => {
    jest.spyOn(getUserService, 'getUserById').mockResolvedValue(userEntityMock);
    jest.spyOn(userRepository, 'delete').mockImplementation(() => {
      return Promise.resolve(fakeUserDeleteResponseDTO);
    });

    const result: UserDeleteResponseDTO =
      await deleteUserService.delete(fakeId);
    expect(result).toBeDefined();
    expect(result.deleted).toBe(true);
  });
});
