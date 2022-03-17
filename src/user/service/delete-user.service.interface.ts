import { UserDeleteResponseDTO } from '@users/dto';

export interface IDeleteUserService {
  delete(id: string): Promise<UserDeleteResponseDTO>;
}
