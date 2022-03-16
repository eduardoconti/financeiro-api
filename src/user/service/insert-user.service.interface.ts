import { UserDTO } from 'src/user/dto';
import { Users } from 'src/user/entity';

export interface IInsertUserService {
  insert(userRequest: UserDTO): Promise<Users>;
}
