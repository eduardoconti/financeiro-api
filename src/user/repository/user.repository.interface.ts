import { UserDeleteResponseDTO, UserDTO } from '@users/dto';
import { Users } from '@users/entity';
import { FindUserByParams } from '@users/types';

export interface IUserRepository {
  insert(userRequest: UserDTO): Promise<Users>;
  delete(id: string): Promise<UserDeleteResponseDTO>;
  findAll(): Promise<Users[]>;
  findOneByParams(params: FindUserByParams): Promise<Users | null>;
  findByParams(params: FindUserByParams): Promise<Users[] | undefined>;
}
