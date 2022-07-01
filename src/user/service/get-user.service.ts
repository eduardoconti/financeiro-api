import { Inject, Injectable } from '@nestjs/common';

import { ERROR_MESSAGES } from '@users/constants';
import { UserNotFoundException } from '@users/exception';
import { IUserRepository } from '@users/repository';

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
    const user = await this.userRepository.findByParams();
    if (!user) {
      throw new UserNotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  async getUserByLogin(login: string): Promise<Users> {
    const user = await this.userRepository.findByParams({ login });
    if (!user) {
      throw new UserNotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user[0];
  }

  async getUserById(id: string): Promise<Users> {
    const user = await this.userRepository.findByParams({ id });
    if (!user) {
      throw new UserNotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user[0];
  }
}
