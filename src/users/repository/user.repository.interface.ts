import { UserDeleteResponseDTO, UserDTO } from '@users/dto';
import { Users } from '@users/entity';

export interface IUserRepository {
  insert(userRequest: UserDTO): Promise<Users>;
  delete(id: string): Promise<UserDeleteResponseDTO>;
  findAll(): Promise<Users[]>;
  findByLogin(login: string): Promise<Users>;
}
