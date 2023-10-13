import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ERROR_MESSAGES } from '@users/constants';
import { UserDeleteResponseDTO, UserDTO } from '@users/dto';
import { Users } from '@users/entity';
import {
  DeleteUserException,
  GetUserException,
  InsertUserException,
} from '@users/exception';
import { FindUserByParams } from '@users/types';

import { IUserRepository } from './user.repository.interface';
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async findByParams(params?: FindUserByParams): Promise<Users[] | undefined> {
    const result = await this.userRepository
      .find({ where: params })
      .catch(error => {
        throw new GetUserException(
          ERROR_MESSAGES.USER_FIND_ERROR,
          error,
          params,
        );
      });
    return result.length > 0 ? result : undefined;
  }

  async delete(user: Users): Promise<UserDeleteResponseDTO> {
    await this.userRepository.remove(user).catch(error => {
      throw new DeleteUserException(ERROR_MESSAGES.USER_DELETE_ERROR, error);
    });
    return new UserDeleteResponseDTO(true);
  }

  async insert(userRequest: UserDTO): Promise<Users> {
    const newUser = await this.userRepository.create(userRequest);

    return await this.userRepository.save(newUser).catch(error => {
      throw new InsertUserException(ERROR_MESSAGES.USER_CREATE_ERROR, error);
    });
  }
}
