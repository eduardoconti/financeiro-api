import { UserDeleteResponseDTO, UserDTO } from '@users/dto';
import { Users } from '@users/entity';
import { FindUserByParams } from '@users/types';

export interface IUserRepository {
  insert(userRequest: UserDTO): Promise<Users>;
  delete(user: Users): Promise<UserDeleteResponseDTO>;
  findByParams(params?: FindUserByParams): Promise<Users[] | undefined>;
}
