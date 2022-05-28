import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { UserDeleteResponseDTO } from '@users/dto';
import { DeleteUserException } from '@users/exception';
import { IUserRepository } from '@users/repository';

import { TYPES } from '@config/dependency-injection';

import { DeleteUserService } from './delete-user.service';
import { IDeleteUserService } from './delete-user.service.interface';

const fakeUserDeleteResponseDTO = new UserDeleteResponseDTO(true);
const fakeId = '6fdeff33-a45d-4e51-b6f0-b7e695f72089';
describe('DeleteUserService', () => {
  let deleteUserService: IDeleteUserService;
  let userRepository: IUserRepository;

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
          provide: TYPES.DeleteUserService,
          useClass: DeleteUserService,
        },
      ],
    }).compile();

    deleteUserService = module.get<IDeleteUserService>(TYPES.DeleteUserService);
    userRepository = module.get<IUserRepository>(TYPES.UserRepository);
  });

  it('should be defined', () => {
    expect(deleteUserService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should delete user', async () => {
    jest.spyOn(userRepository, 'delete').mockImplementation(() => {
      return Promise.resolve(fakeUserDeleteResponseDTO);
    });

    const result: UserDeleteResponseDTO = await deleteUserService.delete(
      fakeId,
    );
    expect(result).toBeDefined();
    expect(result.deleted).toBe(true);
  });

  it('should throw DeleteUserException', async () => {
    jest.spyOn(userRepository, 'delete').mockImplementation(() => {
      return Promise.reject(new DeleteUserException('any'));
    });

    await expect(deleteUserService.delete(fakeId)).rejects.toThrow();
  });
});
