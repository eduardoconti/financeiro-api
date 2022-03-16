import { Users } from 'src/user/entity/users.entity';

import { UserPayloadInterface } from '../interfaces/user-payload.interface';

export class UserPayloadDto implements UserPayloadInterface {
  userId: string;
  userName: string;
  userProfile: number;

  constructor(users: Users) {
    this.userId = users.id;
    this.userName = users.login;
    this.userProfile = users.perfil;
  }
}
