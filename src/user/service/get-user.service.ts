import { Inject, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/user/constants';
import { UserNotFoundException } from 'src/user/exception';
import { IUserRepository } from 'src/user/repository';

import { TYPES } from '@config/dependency-injection';

import { Users } from '../entity/users.entity';
import { IGetUserService } from './get-user.service.interface';

@Injectable()
export class GetUserService implements IGetUserService {
  constructor(
    @Inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
  ) {}

  async getAll(): Promise<Users[]> {
    return await this.userRepository.findAll();
  }

  async getUserByLogin(login: string): Promise<Users> {
    const user = await this.userRepository.findOneByParams({ login });
    if (!user) {
      throw new UserNotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  async getUserById(id: string): Promise<Users> {
    const user = await this.userRepository.findOneByParams({ id });
    if (!user) {
      throw new UserNotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }
}
