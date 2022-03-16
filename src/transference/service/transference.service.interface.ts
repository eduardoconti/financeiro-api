import {
  TransferenceDeleteResponseDTO,
  TransferencePathFlagPayedDTO,
  TransferenciasDTO,
} from 'src/transference/dto';
import { Transferencias } from 'src/transference/entity';

export interface ITransferenceService {
  retornaTodas(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<Transferencias[]>;

  getOne(id: number): Promise<Transferencias>;

  insereTransferencia(
    transferencia: TransferenciasDTO,
  ): Promise<Transferencias>;

  alteraTransferencia(
    id: number,
    transferencia: TransferenciasDTO,
  ): Promise<Transferencias>;

  alteraFlagPago(
    id: number,
    transferencia: TransferencePathFlagPayedDTO,
  ): Promise<Transferencias>;

  deletaTransferencia(id: number): Promise<TransferenceDeleteResponseDTO>;

  retornaValorDespesasAgrupadosPorCarteiraOrigem(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<any[]>;

  retornaValorDespesasAgrupadosPorCarteiraDestino(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<any[]>;
}
