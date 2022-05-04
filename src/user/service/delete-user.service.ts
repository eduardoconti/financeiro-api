import { Inject } from '@nestjs/common';

import { UserDeleteResponseDTO } from '@users/dto';
import { IUserRepository } from '@users/repository';

import { TYPES } from '@config/dependency-injection';

import { IDeleteUserService } from './delete-user.service.interface';

export class DeleteUserService implements IDeleteUserService {
  constructor(
    @Inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async delete(id: string): Promise<UserDeleteResponseDTO> {
    return this.userRepository.delete(id);
  }
}
