import { UserDeleteResponseDTO } from 'src/user/dto';

export interface IDeleteUserService {
  delete(id: string): Promise<UserDeleteResponseDTO>;
}
