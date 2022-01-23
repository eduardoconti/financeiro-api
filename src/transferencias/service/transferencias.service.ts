import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/shared/constants/messages';
import { Repository } from 'typeorm';

import { TransferenciasDTO } from '../dto/transferencias.dto';
import { Transferencias } from '../entity/transferencias.entity';

const select = [
  'transferencias.id',
  'transferencias.valor',
  'transferencias.pago',
  'transferencias.transferencia',
  'carteiraOrigem',
  'carteiraDestino',
  'user',
];

function CriaWhereMes(mes: number) {
  return typeof mes === 'undefined' || mes == 0
    ? 'TRUE'
    : "date_part('month',transferencias.transferencia)=" + String(mes);
}

function CriaWherePago(pago: boolean) {
  return typeof pago === 'undefined' ? 'TRUE' : 'transferencias.pago=' + pago;
}

function CriaWhereAno(ano: number) {
  return typeof ano == 'undefined' || ano == 0
    ? 'TRUE'
    : "date_part('year',transferencias.transferencia)=" + String(ano);
}

@Injectable()
export class TransferenciaService {
  constructor(
    @Inject('TRANSFERENCIAS')
    private transferenciaRepository: Repository<Transferencias>,
  ) {}

  async retornaTodas(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<Transferencias[]> {
    mes = mes ?? 0;
    ano = ano ?? 0;
    try {
      const transferencias = await this.transferenciaRepository
        .createQueryBuilder('transferencias')
        .select(select)
        .innerJoin('transferencias.carteiraOrigem', 'carteiraOrigem')
        .innerJoin('transferencias.carteiraDestino', 'carteiraDestino')
        .innerJoin('transferencias.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(CriaWhereAno(ano))
        .andWhere(CriaWhereMes(mes))
        .andWhere(CriaWherePago(pago))
        .orderBy('carteiraOrigem.descricao', 'ASC')
        .getMany();
      return transferencias;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOne(id: number, userId?: string): Promise<Transferencias> {
    try {
      const transferencia = await this.transferenciaRepository.findOneOrFail(
        { id },
        { relations: ['carteiraOrigem', 'carteiraDestino', 'user'] },
      );

      if (userId && transferencia.user.id !== userId) {
        throw new UnauthorizedException(
          ERROR_MESSAGES.USER_TOKEN_NOT_EQUALS_TO_PARAM_URL,
        );
      }
      return transferencia;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async insereTransferencia(
    transferencia: TransferenciasDTO,
  ): Promise<Transferencias> {
    try {
      const newTransferencias = await this.transferenciaRepository.create(
        transferencia,
      );
      await this.transferenciaRepository.save(newTransferencias);
      return newTransferencias;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraTransferencia(
    id: number,
    transferencia: TransferenciasDTO,
    userId: string,
  ): Promise<Transferencias> {
    try {
      await this.getOne(id, userId);
      await this.transferenciaRepository.update({ id }, transferencia);
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraFlagPago(id: number, transferencia, userId: string) {
    try {
      await this.getOne(id, userId);
      await this.transferenciaRepository.update({ id }, transferencia);
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletaTransferencia(
    id: number,
    userId: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.getOne(id, userId);
      await this.transferenciaRepository.delete({ id });
      return { deleted: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async retornaValorDespesasAgrupadosPorCarteiraOrigem(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ) {
    try {
      const transferencias = await this.transferenciaRepository
        .createQueryBuilder('transferencias')
        .select([
          'carteiraOrigem.id id',
          'carteiraOrigem.descricao descricao',
          'SUM(transferencias.valor) valor',
        ])
        .innerJoin('transferencias.carteiraOrigem', 'carteiraOrigem')
        .innerJoin('transferencias.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(CriaWhereAno(ano))
        .andWhere(CriaWhereMes(mes))
        .andWhere(CriaWherePago(pago))
        .groupBy('carteiraOrigem.id')
        .orderBy('valor', 'DESC')
        .getRawMany();

      return transferencias;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async retornaValorDespesasAgrupadosPorCarteiraDestino(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ) {
    try {
      const transferencias = await this.transferenciaRepository
        .createQueryBuilder('transferencias')
        .select([
          'carteiraDestino.id id',
          'carteiraDestino.descricao descricao',
          'SUM(transferencias.valor) valor',
        ])
        .innerJoin('transferencias.carteiraDestino', 'carteiraDestino')
        .innerJoin('transferencias.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .where(CriaWhereAno(ano))
        .andWhere(CriaWhereMes(mes))
        .andWhere(CriaWherePago(pago))
        .groupBy('carteiraDestino.id')
        .orderBy('valor', 'DESC')
        .getRawMany();

      return transferencias;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
