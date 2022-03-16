import { Users } from 'src/user/entity';

export interface IGetUserService {
  getAll(): Promise<Users[]>;
  getUserByLogin(login: string): Promise<Users>;
  getUserById(id: string): Promise<Users>;
}
