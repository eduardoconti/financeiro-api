import { Receitas } from '../entity/receitas.entity';

export class ReceitasResponseDTO {
  id: number;
  userId: string;
  descricao: string;
  valor: number;
  pagamento: Date;
  pago: boolean;
  carteiraId: number;

  constructor(receita: Receitas) {
    this.id = receita.id;
    this.descricao = receita.descricao;
    this.valor = receita.valor;
    this.pagamento = receita.pagamento;
    this.valor = receita.valor;
    this.pago = receita.pago;
    this.carteiraId = receita.carteiraId;
    this.userId = receita.userId;
  }
}
