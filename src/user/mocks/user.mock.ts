import { UserDTO } from '@users/dto';
import { Users } from '@users/entity';

import { fakeUserId } from '@expense/mocks';

export const userRequest = new UserDTO();
userRequest.login = 'teste';
userRequest.password = 'teste';
userRequest.nome = 'teste';
userRequest.status = 1;
userRequest.perfil = 1;
export const userEntityMock = Users.build({
  ...userRequest,
  id: fakeUserId,
});
