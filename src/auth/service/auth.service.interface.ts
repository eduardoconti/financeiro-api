import { SignDto, UserPayloadDto } from '@auth/dto';

import { Users } from '@users/entity';

export interface IAuthService {
  validateUser(login: string, pass: string): Promise<Users | undefined>;
  login(user: UserPayloadDto): Promise<SignDto>;
}
