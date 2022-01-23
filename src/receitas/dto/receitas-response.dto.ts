import { Receitas } from '../entity/receitas.entity';

export class ReceitasResponseDTO {
  id: number;
  user: string;
  descricao: string;
  valor: number;
  pagamento: Date;
  pago: boolean;
  carteira: number;

  constructor(receita: Receitas) {
    this.id = receita.id;
    this.descricao = receita.descricao;
    this.valor = receita.valor;
    this.pagamento = receita.pagamento;
    this.valor = receita.valor;
    this.pago = receita.pago;
    this.carteira = receita.carteira;
    this.user = receita.user;
  }
}
