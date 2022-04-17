import { Earning } from '../entity/earning.entity';

export class ReceitasResponseDTO {
  id?: number;
  userId: string;
  descricao: string;
  pagamento?: Date;
  valor: number;
  pago?: boolean;
  carteiraId: number;

  constructor(receita: Earning) {
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
