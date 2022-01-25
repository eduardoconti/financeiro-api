import { Users } from '@users/entity';

export interface IGetUserService {
  getAll(): Promise<Users[]>;
  getUserByLogin(login: string): Promise<Users>;
}
