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

  async findAll(): Promise<Users[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new GetUserException(
        ERROR_MESSAGES.USER_SELECT_FIND_ALL_ERROR,
        error,
      );
    }
  }

  async findOneByParams(params: FindUserByParams): Promise<Users | null> {
    try {
      return await this.userRepository.findOne({ where: params });
    } catch (error) {
      throw new GetUserException(ERROR_MESSAGES.USER_FIND_ERROR, error, params);
    }
  }

  async findByParams(params: FindUserByParams): Promise<Users[] | undefined> {
    try {
      return await this.userRepository.find({ where: params });
    } catch (error) {
      throw new GetUserException(ERROR_MESSAGES.USER_FIND_ERROR, error, params);
    }
  }

  async delete(id: string): Promise<UserDeleteResponseDTO> {
    try {
      await this.userRepository.delete({ id });
      return new UserDeleteResponseDTO(true);
    } catch (error) {
      throw new DeleteUserException(ERROR_MESSAGES.USER_DELETE_ERROR, error);
    }
  }

  async insert(userRequest: UserDTO): Promise<Users> {
    try {
      const newUser = await this.userRepository.create(userRequest);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new InsertUserException(ERROR_MESSAGES.USER_CREATE_ERROR, error);
    }
  }
}
