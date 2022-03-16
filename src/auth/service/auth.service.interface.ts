import { Users } from 'src/user/entity';

import { SignDto, UserPayloadDto } from '@auth/dto';

export interface IAuthService {
  validateUser(login: string, pass: string): Promise<Users | undefined>;
  login(user: UserPayloadDto): Promise<SignDto>;
}
