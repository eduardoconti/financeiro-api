import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../entity/users.entity';
import { UserDto } from '../dto/users.dto';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_MESSAGES } from '../constants/messages.constants';
import { IPasswordManagerService } from './password-mannager.service.interface';
import { UserDeleteResponseDTO } from '@users/dto';
import { IUserService } from './users.service.interface';
import { TYPES } from '@config/dependency-injection';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @Inject(TYPES.UserRepository)
    private userRepository: Repository<Users>,
    @Inject(TYPES.PasswordManagerService)
    private passwordManager: IPasswordManagerService,
  ) { }

  async returnAllUsers(): Promise<Users[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new NotFoundException(
        error,
        ERROR_MESSAGES.USER_SELECT_FIND_ALL_ERROR,
      );
    }
  }

  async returnUserByLogin(login: string): Promise<Users> {
    try {
      return await this.userRepository.findOne({ where: [{ login: login }] });
    } catch (error) {
      throw new NotFoundException(error, ERROR_MESSAGES.USER_FIND_BY_ID_ERROR);
    }
  }

  async createUser(user: UserDto): Promise<Users> {
    let passwordHash: string = await this.passwordManager.getHash(
      user.password,
    );

    user.password = passwordHash;
    user.id = uuidv4();

    const newUser = await this.userRepository.create(user);

    try {
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new BadRequestException(error, ERROR_MESSAGES.USER_CREATE_ERROR);
    }
  }

  async deletUser(id: string): Promise<UserDeleteResponseDTO> {
    try {
      await this.userRepository.delete({ id });
      return new UserDeleteResponseDTO(true);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
