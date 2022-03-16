import { Inject } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/user/constants';
import { UserDTO } from 'src/user/dto';
import { Users } from 'src/user/entity';
import { UserLoginAlreadyExistsException } from 'src/user/exception';
import { IUserRepository } from 'src/user/repository';
import { v4 as uuidv4 } from 'uuid';

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