import { Carteiras } from 'src/carteiras/entity/carteiras.entity';
import { Categorias } from 'src/categorias/entity/categorias.entity';
import { Users } from 'src/users/entity/users.entity';
import { Despesas } from '../entity/despesas.entity';

export class DespesasResponseDTO {
  id: number;
  user: string | Users;
  descricao: string;
  categoria: number | Categorias;
  carteira: number | Carteiras;
  valor: number;
  vencimento: Date;
  pagamento: Date;
  pago: boolean;

  constructor(despesas: Despesas) {
    this.id = despesas.id;
    this.descricao = despesas.descricao;
    this.valor = despesas.valor;
    this.vencimento = despesas.vencimento;
    this.pagamento = despesas.pagamento;
    this.pago = despesas.pago;
    this.carteira = despesas.carteira.id;
    this.categoria = despesas.categoria.id;
    this.user = despesas.user.id;
  }
}
