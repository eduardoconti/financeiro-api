import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import { EXPENSE_ERROR_MESSAGES } from '@despesas/constants';
import { DespesasDTO, ExpensePatchFlagPayedDTO } from '@despesas/dto';
import { ExpenseDeletedResponse } from '@despesas/interface';

import { ExpensesGroupMonthDTO } from '../dto/expenses-group-month-response.dto';
import { Despesas } from '../entity/despesas.entity';
import { IExpenseService } from './expense.service.interface';
@Injectable()
export class DespesaService implements IExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private despesaRepository: Repository<Despesas>,
  ) {}

  private CriaWhereMes(mes?: number) {
    return !mes || mes == 0
      ? 'TRUE'
      : "date_part('month',despesas.vencimento)=" + String(mes);
  }

  private CriaWherePago(pago?: boolean) {
    return typeof pago === 'undefined' ? 'TRUE' : 'despesas.pago=' + pago;
  }

  private CriaWhereAno(ano?: number) {
    return !ano || ano == 0
      ? 'TRUE'
      : "date_part('year',despesas.vencimento)=" + String(ano);
  }
  async retornaTodasDespesas(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<Despesas[]> {
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
        'carteira',
      ];
      const despesas = await this.despesaRepository
        .createQueryBuilder('despesas')
        .select(select)
        .innerJoin('despesas.categoria', 'categoria')
        .innerJoin('despesas.carteira', 'carteira')
        .innerJoin('despesas.user', 'user')
        .orderBy('despesas.valor', 'DESC')
        .where('user.id= :userId', { userId: userId })
        .andWhere(this.CriaWhereAno(ano))
        .andWhere(this.CriaWhereMes(mes))
        .andWhere(this.CriaWherePago(pago))
        .getMany();

      return despesas;
    } catch (error) {
      throw new BadRequestException(
        error,
        EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_FIND_BY_ID_OR_ALL_ERROR,
      );
    }
  }

  async retornaValorDespesasAgrupadosPorCategoria(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<any[]> {
    try {
      const despesas = await this.despesaRepository
        .createQueryBuilder('despesas')
        .select([
          'SUM(despesas.valor) valor',
          'categoria.descricao descricao',
          'categoria.id id',
        ])
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
      throw new BadRequestException(
        error,
        EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_GROUP_MONTH_ERROR,
      );
    }
  }

  async retornaValorDespesasAgrupadosPorCarteira(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<any[]> {
    try {
      const despesas = await this.despesaRepository
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
      throw new BadRequestException(
        error,
        EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_GROUP_CATEGORY_ERROR,
      );
    }
  }

  async retornaTotalDespesas(
    ano = 0,
    mes = 0,
    pago?: boolean,
    userId?: string,
  ): Promise<number> {
    try {
      const { sum } = await this.despesaRepository
        .createQueryBuilder('despesas')
        .select('SUM(despesas.valor)', 'sum')
        .innerJoin('despesas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(this.CriaWhereAno(ano))
        .andWhere(this.CriaWhereMes(mes))
        .andWhere(this.CriaWherePago(pago))
        .getRawOne();

      return sum ? parseFloat(sum.toFixed(2)) : 0;
    } catch (error) {
      throw new BadRequestException(
        error,
        EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_FIND_BY_ID_OR_ALL_ERROR,
      );
    }
  }

  async retornaDespesasAgrupadasPorMes(
    ano?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<{ [k: string]: ExpensesGroupMonthDTO<Despesas> }> {
    try {
      // const dateWhere = (ano: number) =>
      //   Between(new Date(ano, 0, 1), new Date(ano, 11, 31));
      const where: { [k: string]: any } = {};

      if (ano) {
        //where.vencimento = dateWhere(ano)
      }
      if (userId) {
        where.user = {
          id: userId,
        };
      }
      if (pago != null) {
        where.pago = pago;
      }
      const despesas = await this.despesaRepository.find({
        relations: ['categoria', 'user', 'carteira'],
        where: where,
        order: { vencimento: 'ASC' },
      });

      const monthExpenses: {
        [key: string]: ExpensesGroupMonthDTO<Despesas>;
      } = {};

      despesas.forEach((element) => {
        const key =
          String(element.vencimento.getFullYear()) +
          String('0' + element.vencimento.getMonth()).slice(-2);

        if (key in monthExpenses) {
          monthExpenses[key].quantity++;
          monthExpenses[key].total += element.valor;
          if (element.pago) {
            monthExpenses[key].totalPayed += element.valor;
          } else {
            monthExpenses[key].totalOpen += element.valor * 100;
          }
          monthExpenses[key].data.push(element);
        } else {
          monthExpenses[key] = new ExpensesGroupMonthDTO<Despesas>(
            element.vencimento.getMonth(),
            element.valor,
            element.pago ? element.valor : 0,
            element.pago ? 0 : element.valor,
            1,
            [element],
          );
        }
      });

      return monthExpenses;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_GROUP_MONTH_ERROR,
      );
    }
  }

  async getOne(id: number): Promise<Despesas> {
    try {
      const despesa = await this.despesaRepository.findOneOrFail(
        { id },
        { relations: ['carteira', 'categoria', 'user'] },
      );

      return despesa;
    } catch (error) {
      throw new BadRequestException(
        error,
        EXPENSE_ERROR_MESSAGES.EXPENSE_SELECT_FIND_BY_ID_OR_ALL_ERROR,
      );
    }
  }

  async insereDespesa(despesa: DespesasDTO): Promise<Despesas> {
    try {
      const newDespesas = await this.despesaRepository.create(despesa);
      await this.despesaRepository.save(newDespesas);
      return newDespesas;
    } catch (error) {
      throw new BadRequestException(
        error,
        EXPENSE_ERROR_MESSAGES.EXPENSE_CREATE_ERROR,
      );
    }
  }

  async alteraDespesa(id: number, despesa: DespesasDTO): Promise<Despesas> {
    try {
      await this.getOne(id);
      await this.despesaRepository.update({ id }, despesa);
      return await this.getOne(id);
    } catch (error) {
      throw new BadRequestException(
        error,
        EXPENSE_ERROR_MESSAGES.EXPENSE_UPDATE_ERROR,
      );
    }
  }

  async alteraFlagPago(
    id: number,
    patchData: ExpensePatchFlagPayedDTO,
  ): Promise<Despesas> {
    try {
      const res = await this.getOne(id);
      if (res.pago !== patchData.pago) {
        await this.despesaRepository.update({ id }, patchData);
        res.pago = patchData.pago;
      }
      return res;
    } catch (error) {
      throw new BadRequestException(
        error,
        EXPENSE_ERROR_MESSAGES.EXPENSE_UPDATE_ERROR,
      );
    }
  }

  async deletaDespesa(id: number): Promise<ExpenseDeletedResponse> {
    try {
      await this.getOne(id);
      await this.despesaRepository.delete({ id });
      return { deleted: true } as ExpenseDeletedResponse;
    } catch (error) {
      throw new BadRequestException(
        error,
        EXPENSE_ERROR_MESSAGES.EXPENSE_DELETE_ERROR,
      );
    }
  }
}
