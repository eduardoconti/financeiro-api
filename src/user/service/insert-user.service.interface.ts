import { UserDTO } from '@users/dto';
import { Users } from '@users/entity';

export interface IInsertUserService {
  insert(userRequest: UserDTO): Promise<Users>;
}
