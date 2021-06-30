import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransferenciasDTO } from '../dto/transferencias.dto';
import { Transferencias } from '../entity/transferencias.entity';

const select = [
  'transferencias.id',
  'transferencias.valor',
  'transferencias.pago',
  'transferencias.dataTransferencia',
  'carteiraOrigem',
  'carteiraDestino',
  'user',
];

function CriaWhereMes(mes: number) {
  return typeof mes === 'undefined' || mes == 0
    ? 'TRUE'
    : "date_part('month',transferencias.dataTransferencia)=" + String(mes);
}

function CriaWherePago(pago: boolean) {
  return typeof pago === 'undefined' ? 'TRUE' : 'transferencias.pago=' + pago;
}

function CriaWhereAno(ano: number) {
  return typeof ano == 'undefined' || ano == 0
    ? 'TRUE'
    : "date_part('month',transferencias.dataTransferencia)=" + String(ano);
}

@Injectable()
export class TransferenciaService {
  constructor(
    @Inject('TRANSFERENCIAS')
    private transferenciaRepository: Repository<Transferencias>,
  ) {}

  async retornaTodas(
    ano: number,
    mes: number,
    pago: boolean,
  ): Promise<Transferencias[]> {
    mes = mes ?? 0;
    ano = ano ?? 0;
    try {
      let transferencias = await this.transferenciaRepository
        .createQueryBuilder('transferencias')
        .select(select)
        .innerJoin('transferencias.carteiraOrigem', 'carteiraOrigem')
        .innerJoin('transferencias.carteiraDestino', 'carteiraDestino')
        .orderBy('carteiraOrigem.descricao', 'ASC')
        .where(CriaWhereAno(ano))
        .andWhere(CriaWhereMes(mes))
        .andWhere(CriaWherePago(pago))
        .getMany();
      return transferencias;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOne(id: number): Promise<Transferencias> {
    try {
      return await this.transferenciaRepository.findOneOrFail(
        { id },
        { relations: ['carteiraOrigem', 'carteiraDestino', 'user'] },
      );
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
    transferencia: TransferenciasDTO,
    id: number,
  ): Promise<Transferencias> {
    try {
      await this.transferenciaRepository.update({ id }, transferencia);
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraFlagPago(transferencia) {
    try {
      const { id } = transferencia;
      await this.transferenciaRepository.update({ id }, transferencia);
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletaTransferencia(
    id: number,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
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
  ) {
    try {
      let transferencias = await this.transferenciaRepository
        .createQueryBuilder('transferencias')
        .select([
          'carteiraOrigem.id id',
          'carteiraOrigem.descricao descricao',
          'SUM(transferencias.valor) valor',
        ])
        .innerJoin('transferencias.carteiraOrigem', 'carteiraOrigem')
        .where(CriaWhereAno(ano))
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
  ) {
    try {
      let transferencias = await this.transferenciaRepository
        .createQueryBuilder('transferencias')
        .select([
          'carteiraDestino.id id',
          'carteiraDestino.descricao descricao',
          'SUM(transferencias.valor) valor',
        ])
        .innerJoin('transferencias.carteiraDestino', 'carteiraDestino')
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
