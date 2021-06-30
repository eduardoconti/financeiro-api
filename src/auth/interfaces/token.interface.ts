import { UserPayloadInterface } from './user-payload.interface';

export interface TokenInterface extends UserPayloadInterface {
  iat: number;
  exp: number;
}
