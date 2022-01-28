import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { YIELD_ERROR_MESSAGES } from '@receitas/constants';
import {
  EarningDeleteResponseDTO,
  EarningsGroupMonthDTO,
  ReceitasDTO,
} from '@receitas/dto';
import { Receitas } from '@receitas/entity';

import { TYPES } from '@config/dependency-injection';

const select = [
  'receitas.id',
  'receitas.descricao',
  'receitas.valor',
  'receitas.pago',
  'receitas.pagamento',
  'carteira',
];

@Injectable()
export class ReceitaService {
  constructor(
    @Inject(TYPES.EarningRepository)
    private receitaRepository: Repository<Receitas>,
  ) {}

  async retornaTodasReceitas(
    ano?: number,
    mes?: number,
    pago?: boolean | undefined,
    userId?: string,
  ): Promise<Receitas[]> {
    mes = mes ?? 0;
    ano = ano ?? 0;

    try {
      const receitas = await this.receitaRepository
        .createQueryBuilder('receitas')
        .select(select)
        .innerJoin('receitas.carteira', 'carteira')
        .innerJoin('receitas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(this.CriaWhereAno(ano))
        .andWhere(this.CriaWhereMes(mes))
        .andWhere(this.CriaWherePago(pago))
        .orderBy('receitas.valor', 'DESC')
        .getMany();

      return receitas;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async retornaValorReceitasAgrupadosPorCarteira(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<any[]> {
    try {
      const receitas = await this.receitaRepository
        .createQueryBuilder('receitas')
        .select([
          'SUM(receitas.valor) valor',
          'carteira.descricao descricao',
          'carteira.id id',
        ])
        .innerJoin('receitas.carteira', 'carteira')
        .innerJoin('receitas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(this.CriaWhereAno(ano))
        .andWhere(this.CriaWhereMes(mes))
        .andWhere(this.CriaWherePago(pago))
        .groupBy('carteira.id')
        .orderBy('valor', 'DESC')
        .getRawMany();
      return receitas.map((receita) => {
        const valor = receita.valor ? parseFloat(receita.valor.toFixed(2)) : 0;
        return { ...receita, valor: valor };
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async retornaTotalReceitas(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<number> {
    try {
      const { sum } = await this.receitaRepository
        .createQueryBuilder('receitas')
        .select('SUM(receitas.valor)', 'sum')
        .innerJoin('receitas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(this.CriaWhereAno(ano))
        .andWhere(this.CriaWhereMes(mes))
        .andWhere(this.CriaWherePago(pago))
        .getRawOne();
      return sum ? parseFloat(sum.toFixed(2)) : 0;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async retornaReceitasAgrupadasPorMes(
    ano?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<{ [key: string]: EarningsGroupMonthDTO<Receitas> }> {
    try {
      // const dateWhere = (ano: number) =>
      //   Between(new Date(ano, 0, 1), new Date(ano, 11, 31));
      const where: { [k: string]: any } = {};

      if (ano) {
        //where.pagamento = dateWhere(ano)
      }
      if (userId) {
        where.user = {
          id: userId,
        };
      }
      if (pago != null) {
        where.pago = pago;
      }
      const receitas = await this.receitaRepository.find({
        relations: ['user', 'carteira'],
        where: where,
        order: { pagamento: 'ASC' },
      });

      const monthEarnings: {
        [key: string]: EarningsGroupMonthDTO<Receitas>;
      } = {};

      receitas.forEach((element) => {
        const key =
          String(element.pagamento.getFullYear()) +
          String('0' + element.pagamento.getMonth()).slice(-2);

        if (key in monthEarnings) {
          monthEarnings[key].quantity++;
          monthEarnings[key].total += element.valor;
          if (element.pago) {
            monthEarnings[key].totalPayed += element.valor;
          } else {
            monthEarnings[key].totalOpen += element.valor;
          }

          monthEarnings[key].data.push(element);
        } else {
          monthEarnings[key] = new EarningsGroupMonthDTO(
            element.pagamento.getMonth(),
            element.valor,
            element.pago ? element.valor : 0,
            element.pago ? 0 : element.valor,
            1,
            [element],
          );
        }
      });
      return monthEarnings;
    } catch (error) {
      throw new BadRequestException(
        error,
        YIELD_ERROR_MESSAGES.YIELD_SELECT_GROUP_MONTH_ERROR,
      );
    }
  }

  async getOne(id: number): Promise<Receitas> {
    try {
      const receita = await this.receitaRepository.findOneOrFail(
        { id },
        { relations: ['carteira', 'user'] },
      );

      return receita;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async insereReceita(receita: ReceitasDTO): Promise<Receitas> {
    const newReceitas = await this.receitaRepository.create(receita);
    try {
      await this.receitaRepository.save(newReceitas);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return newReceitas;
  }

  async alteraReceita(receitaDto: ReceitasDTO, id: number): Promise<Receitas> {
    try {
      const receita = await this.getOne(id);
      await this.receitaRepository.update({ id }, receitaDto);
      return receita;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraFlagPago(receitaDto: ReceitasDTO, id: number): Promise<Receitas> {
    try {
      const receita = await this.getOne(id);
      await this.receitaRepository.update({ id }, receitaDto);
      return receita;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletaReceita(id: number): Promise<EarningDeleteResponseDTO> {
    try {
      await this.getOne(id);
      await this.receitaRepository.delete({ id });
      return new EarningDeleteResponseDTO(true);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private CriaWhereMes(mes?: number) {
    return !mes || mes == 0
      ? 'TRUE'
      : "date_part('month',receitas.pagamento)=" + String(mes);
  }

  private CriaWherePago(pago?: boolean) {
    return typeof pago === 'undefined' ? 'TRUE' : 'receitas.pago=' + pago;
  }

  private CriaWhereAno(ano?: number) {
    return !ano || ano == 0
      ? 'TRUE'
      : "date_part('year',receitas.pagamento)=" + String(ano);
  }
}
