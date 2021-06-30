import { Carteiras } from 'src/carteiras/entity/carteiras.entity';
import { Users } from 'src/users/entity/users.entity';
import { Transferencias } from '../entity/transferencias.entity';

export class TransferenciasDTO {
  id: number;
  user: string | Users;
  carteiraOrigem: number | Carteiras;
  carteiraDestino: number | Carteiras;
  dataTransferencia: Date;
  pago: boolean;
  valor: number;

  constructor(transferencia: Transferencias) {
    this.id = transferencia.id;
    this.user = transferencia.user.id;
    this.carteiraOrigem = transferencia.carteiraOrigem.id;
    this.carteiraDestino = transferencia.carteiraDestino.id;
    this.dataTransferencia = transferencia.dataTransferencia;
    this.pago = transferencia.pago;
    this.valor = transferencia.valor;
  }
}
