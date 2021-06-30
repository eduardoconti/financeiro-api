import { Users } from '../entity/users.entity';

export class UserResponseDto {
  id: string;
  login: string;
  nome: string;
  status: number;
  perfil: number;

  constructor(users: Users) {
    this.id = users.id;
    this.login = users.login;
    this.nome = users.nome;
    this.status = users.status;
    this.perfil = users.perfil;
  }
}
