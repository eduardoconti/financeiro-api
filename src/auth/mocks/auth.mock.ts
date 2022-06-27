import { SignDto } from '@auth/dto';
import { UserPayloadInterface } from '@auth/interfaces';

import { fakeUserId } from '@expense/mocks';

export const userPayloadInterfaceMock: UserPayloadInterface = {
  userName: 'teste',
  userId: fakeUserId,
  userProfile: 0,
};

export const singDtoMock: SignDto = {
  accessToken: 'fake token',
};
