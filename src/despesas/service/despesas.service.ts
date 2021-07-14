import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Despesas } from '../entity/despesas.entity';
import { DespesasDTO } from '../dto/despesas.dto';
import { ERROR_MESSAGES } from 'src/shared/constants/messages';
import { ExpensePatchFlagPayedDto } from '../dto/patch-flag-payed.dto';
import { ExpenseDeletedResponse } from '../interface/deleted-response.interface';
import { EXPENSE_ERROR_MESSAGES } from '../constants/messages.constants'
@Injectable()
export class DespesaService {
  constructor(
    @Inject('DESPESAS')
    private despesaRepository: Repository<Despesas>,
  ) {}

  private CriaWhereMes(mes: number) {
    return !mes || mes == 0
      ? 'TRUE'
      : "date_part('month',despesas.vencimento)=" + String(mes);
  }

  private CriaWherePago(pago: boolean) {
    return typeof pago === 'undefined' ? 'TRUE' : 'despesas.pago=' + pago;
  }

  private CriaWhereAno(ano: number) {
    return !ano || ano == 0
      ? 'TRUE'
      : "date_part('year',despesas.vencimento)=" + String(ano);
  }
  async retornaTodasDespesas(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ) {
    mes = mes ?? 0;
    ano = ano ?? 0;
    try {
      const select = [
        'despesas.id',
        'despesas.descricao',
        'despesas.valor',
        'despesas.pago',
        'despesas.vencimento',
        'categoria',
        'carteira'
      ];
      let despesas = await this.despesaRepository
        .createQueryBuilder('despesas')
        .select(select)
        .innerJoin('despesas.categoria', 'categoria')
        .innerJoin('despesas.carteira', 'carteira')
        .innerJoin('despesas.user', 'user')
        .orderBy('despesas.descricao', 'ASC')
        .where('user.id= :userId', { userId: userId })
        .andWhere(this.CriaWhereAno(ano))
        .andWhere(this.CriaWhereMes(mes))
        .andWhere(this.CriaWherePago(pago))
        .getMany();
      
      return despesas;
    } catch (error) {
      throw new BadRequestException(error, EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_FIND_BY_ID_OR_ALL_ERROR);
    }
  }

  async retornaValorDespesasAgrupadosPorCategoria(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ) {
    try {
      let despesas = await this.despesaRepository
        .createQueryBuilder('despesas')
        .select(['SUM(despesas.valor) valor', 'categoria.descricao descricao'])
        .innerJoin('despesas.categoria', 'categoria')
        .innerJoin('despesas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(this.CriaWhereAno(ano))
        .andWhere(this.CriaWhereMes(mes))
        .andWhere(this.CriaWherePago(pago))
        .groupBy('categoria.id')
        .orderBy('valor', 'DESC')
        .getRawMany();

      return despesas;
    } catch (error) {
      throw new BadRequestException(error, EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_GROUP_MONTH_ERROR);
    }
  }

  async retornaValorDespesasAgrupadosPorCarteira(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ) {
    try {
      let despesas = await this.despesaRepository
        .createQueryBuilder('despesas')
        .select([
          'SUM(despesas.valor) valor',
          'carteira.descricao descricao',
          'carteira.id id',
        ])
        .innerJoin('despesas.carteira', 'carteira')
        .innerJoin('despesas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(this.CriaWhereAno(ano))
        .andWhere(this.CriaWhereMes(mes))
        .andWhere(this.CriaWherePago(pago))
        .groupBy('carteira.id')
        .orderBy('valor', 'DESC')
        .getRawMany();

      return despesas;
    } catch (error) {
      throw new BadRequestException(error, EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_GROUP_CATEGORY_ERROR);
    }
  }

  async retornaTotalDespesas(
    ano: number = 0,
    mes: number = 0,
    pago?: boolean,
    userId?: string,
  ): Promise<number> {
    try {
      let { sum } = await this.despesaRepository
        .createQueryBuilder('despesas')
        .select('SUM(despesas.valor)', 'sum')
        .innerJoin('despesas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(this.CriaWhereAno(ano))
        .andWhere(this.CriaWhereMes(mes))
        .andWhere(this.CriaWherePago(pago))
        .getRawOne();

      return sum ? parseFloat(sum.toFixed(2)) : 0 ;
    } catch (error) {
      throw new BadRequestException(error, EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_FIND_BY_ID_OR_ALL_ERROR);
    }
  }

  async retornaDespesasAgrupadasPorMes(
    ano?: number,
    pago?: boolean,
    userId?: string,
  ) {
    try {
      let despesas = await this.despesaRepository
        .createQueryBuilder('despesas')
        .select([
          'SUM(despesas.valor) valor',
          "date_part('month',despesas.vencimento) mes",
        ])
        .innerJoin('despesas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(this.CriaWhereAno(ano))
        .andWhere(this.CriaWherePago(pago))
        .groupBy("date_part('month',despesas.vencimento)")
        .getRawMany();

      return despesas;
    } catch (error) {
      throw new BadRequestException(error, EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_GROUP_MONTH_ERROR);
    }
  }

  /**
   *
   * @param id string
   * @param userId string
   * @returns Despesas
   * @throw UnauthorizedException
   * @throw BadRequestException
   */
  async getOne(id: number, userId?: string): Promise<Despesas> {
    try {
      let despesa = await this.despesaRepository.findOneOrFail(
        { id },
        { relations: ['carteira', 'categoria', 'user'] },
      );

      if (userId && despesa.user.id !== userId) {
        throw new UnauthorizedException(
          ERROR_MESSAGES.USER_TOKEN_NOT_EQUALS_TO_PARAM_URL,
        );
      }

      return despesa;
    } catch (error) {
      throw new BadRequestException(error,EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_FIND_BY_ID_OR_ALL_ERROR);
    }
  }

  async insereDespesa(despesa: DespesasDTO): Promise<Despesas> {
    try {
      const newDespesas = await this.despesaRepository.create(despesa);
      await this.despesaRepository.save(newDespesas);
      return newDespesas;
    } catch (error) {
      throw new BadRequestException(error,EXPENSE_ERROR_MESSAGES.EXPENSE_CREATE_ERROR);
    }
  }

  async alteraDespesa(id: number, despesa: DespesasDTO, userId:string): Promise<Despesas> {
    try {
      await this.getOne(id, userId)
      await this.despesaRepository.update({ id }, despesa);
      return await this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error,EXPENSE_ERROR_MESSAGES.EXPENSE_UPDATE_ERROR);
    }
  }
  /**
   *
   * @param id
   * @param patchData
   * @param userId
   * @returns Despesas
   */
  async alteraFlagPago(
    id: number,
    patchData: ExpensePatchFlagPayedDto,
    userId: string,
  ): Promise<Despesas> {
    try {
      let res = await this.getOne(id, userId);
      if( res.pago !== patchData.pago){       
        await this.despesaRepository.update({ id }, patchData);
        res.pago = patchData.pago
      }
      return res;
    } catch (error) {
      throw new BadRequestException(error,EXPENSE_ERROR_MESSAGES.EXPENSE_UPDATE_ERROR);
    }
  }

  async deletaDespesa(
    id: number,
    userId: string,
  ): Promise<ExpenseDeletedResponse> {
    try {
      await this.getOne(id, userId);
      await this.despesaRepository.delete({ id });
      return { deleted: true } as ExpenseDeletedResponse;
    } catch (error) {
      throw new BadRequestException(error,EXPENSE_ERROR_MESSAGES.EXPENSE_DELETE_ERROR);
    }
  }
}
