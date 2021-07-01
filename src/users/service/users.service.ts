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
import { PasswordManagerService } from './password-mannager.service';
import { ERROR_MESSAGES } from '../constants/messages.constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS')
    private userRepository: Repository<Users>,
    private passwordManager: PasswordManagerService,
  ) {}

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

  async deletUser( id: string ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.userRepository.delete( {id} );
      return { deleted: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
