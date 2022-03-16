import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  TransferenceDeleteResponseDTO,
  TransferencePathFlagPayedDTO,
  TransferenciasDTO,
} from 'src/transference/dto';
import { Transferencias } from 'src/transference/entity';
import { Repository } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import { ITransferenceService } from './transference.service.interface';

const select = [
  'transferencias.id',
  'transferencias.valor',
  'transferencias.pago',
  'transferencias.transferencia',
  'carteiraOrigem',
  'carteiraDestino',
  'user',
];

function CriaWhereMes(mes?: number) {
  return typeof mes === 'undefined' || mes == 0
    ? 'TRUE'
    : "date_part('month',transferencias.transferencia)=" + String(mes);
}

function CriaWherePago(pago?: boolean) {
  return typeof pago === 'undefined' ? 'TRUE' : 'transferencias.pago=' + pago;
}

function CriaWhereAno(ano?: number) {
  return typeof ano == 'undefined' || ano == 0
    ? 'TRUE'
    : "date_part('year',transferencias.transferencia)=" + String(ano);
}

@Injectable()
export class TransferenciaService implements ITransferenceService {
  constructor(
    @Inject(TYPES.TransferenceRepository)
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

  async getOne(id: number): Promise<Transferencias> {
    try {
      const transferencia = await this.transferenciaRepository.findOneOrFail(
        { id },
        { relations: ['carteiraOrigem', 'carteiraDestino', 'user'] },
      );

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
  ): Promise<Transferencias> {
    try {
      await this.getOne(id);
      await this.transferenciaRepository.update({ id }, transferencia);
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraFlagPago(
    id: number,
    transferencia: TransferencePathFlagPayedDTO,
  ): Promise<Transferencias> {
    try {
      await this.getOne(id);
      await this.transferenciaRepository.update({ id }, transferencia);
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletaTransferencia(
    id: number,
  ): Promise<TransferenceDeleteResponseDTO> {
    try {
      await this.getOne(id);
      await this.transferenciaRepository.delete({ id });
      return new TransferenceDeleteResponseDTO();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async retornaValorDespesasAgrupadosPorCarteiraOrigem(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<any[]> {
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
  ): Promise<any[]> {
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
