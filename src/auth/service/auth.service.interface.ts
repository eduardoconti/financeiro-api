import { SignDto, UserPayloadDto } from '@auth/dto';

import { Users } from 'src/user/entity';

export interface IAuthService {
  validateUser(login: string, pass: string): Promise<Users | undefined>;
  login(user: UserPayloadDto): Promise<SignDto>;
}
