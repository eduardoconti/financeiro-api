import { Inject } from '@nestjs/common';

import { UserDeleteResponseDTO } from '@users/dto';
import { IUserRepository } from '@users/repository';

import { TYPES } from '@config/dependency-injection';

import { IDeleteUserService } from './delete-user.service.interface';
import { IGetUserService } from './get-user.service.interface';

export class DeleteUserService implements IDeleteUserService {
  constructor(
    @Inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(TYPES.GetUserService)
    private readonly getUserService: IGetUserService,
  ) {}

  async delete(id: string): Promise<UserDeleteResponseDTO> {
    const user = await this.getUserService.getUserById(id);
    return this.userRepository.delete(user);
  }
}
