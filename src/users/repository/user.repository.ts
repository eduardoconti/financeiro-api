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

  async findById(id: string): Promise<Users> {
    try {
      return await this.userRepository.findOneOrFail({
        where: [{ id: id }],
      });
    } catch (error) {
      throw new GetUserException(ERROR_MESSAGES.USER_FIND_BY_ID_ERROR, error);
    }
  }

  async findByLogin(login: string): Promise<Users | undefined> {
    try {
      return await this.userRepository.findOne({
        where: [{ login: login }],
      });
    } catch (error) {
      throw new GetUserException(
        ERROR_MESSAGES.USER_FIND_BY_LOGIN_ERROR + login,
        error,
      );
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
