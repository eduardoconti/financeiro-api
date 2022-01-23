import { Carteiras } from 'src/carteiras/entity/carteiras.entity';
import { Users } from 'src/users/entity/users.entity';

import { Receitas } from '../entity/receitas.entity';

export class ReceitasResponseDTO {
  id: number;
  user: string | Users;
  descricao: string;
  valor: number;
  pagamento: Date;
  pago: boolean;
  carteira: number | Carteiras;

  constructor(receita: Receitas) {
    this.id = receita.id;
    this.descricao = receita.descricao;
    this.valor = receita.valor;
    this.pagamento = receita.pagamento;
    this.valor = receita.valor;
    this.pago = receita.pago;
    this.carteira = receita.carteira.id;
    this.user = receita.user.id;
  }
}
