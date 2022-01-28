import { Inject, Injectable } from '@nestjs/common';

import { IUserRepository } from '@users/repository';

import { TYPES } from '@config/dependency-injection';
import { BadRequestException } from '@config/exceptions';

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
    const user = await this.userRepository.findByLogin(login);
    if (!user) {
      throw new BadRequestException();
    }
    return user;
  }

  async getUserById(id: string): Promise<Users> {
    return await this.userRepository.findById(id);
  }
}
