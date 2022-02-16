import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ERROR_MESSAGES } from '@users/constants';
import { UserDTO } from '@users/dto';
import { Users } from '@users/entity';
import { UserLoginAlreadyExistsException } from '@users/exception';
import { IUserRepository } from '@users/repository';

import { TYPES } from '@config/dependency-injection';

import { IInsertUserService } from './insert-user.service.interface';
import { IPasswordManagerService } from './password-mannager.service.interface';

export class InsertUserService implements IInsertUserService {
  constructor(
    @Inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(TYPES.PasswordManagerService)
    private passwordManager: IPasswordManagerService,
  ) {}

  async insert(userRequest: UserDTO): Promise<Users> {
    const { login } = userRequest;
    if (await this.userRepository.findOneByParams({ login })) {
      throw new UserLoginAlreadyExistsException(
        ERROR_MESSAGES.USER_LOGIN_ALREADY_EXISTS_ERROR,
      );
    }
    const passwordHash: string = await this.passwordManager.getHash(
      userRequest.password,
    );

    userRequest.password = passwordHash;
    userRequest.id ?? uuidv4();
    return await this.userRepository.insert(userRequest);
  }
}
