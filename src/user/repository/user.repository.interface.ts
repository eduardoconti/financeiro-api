import { UserDeleteResponseDTO, UserDTO } from 'src/user/dto';
import { Users } from 'src/user/entity';
import { FindUserByParams } from 'src/user/types';

export interface IUserRepository {
  insert(userRequest: UserDTO): Promise<Users>;
  delete(id: string): Promise<UserDeleteResponseDTO>;
  findAll(): Promise<Users[]>;
  findOneByParams(params: FindUserByParams): Promise<Users | undefined>;
  findByParams(params: FindUserByParams): Promise<Users[] | undefined>;
}
