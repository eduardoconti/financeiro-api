import { YIELD_ERROR_MESSAGES } from './../constants/messages.constants';
import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Receitas } from '../entity/receitas.entity';
import { ReceitasDTO } from '../dto/receitas.dto';
import { ERROR_MESSAGES } from 'src/users/constants/messages.constants';
import { EarningsGroupMonthDTO } from '../dto';

const select = [
  'receitas.id',
  'receitas.descricao',
  'receitas.valor',
  'receitas.pago',
  'receitas.pagamento',
  'carteira',
];

function CriaWhereMes(mes: number) {
  return !mes || mes == 0
    ? 'TRUE'
    : "date_part('month',receitas.pagamento)=" + String(mes);
}

function CriaWherePago(pago: boolean | undefined) {
  return typeof pago === 'undefined' ? 'TRUE' : 'receitas.pago=' + pago;
}

function CriaWhereAno(ano?: number) {
  return !ano || ano == 0
    ? 'TRUE'
    : "date_part('year',receitas.pagamento)=" + String(ano);
}

@Injectable()
export class ReceitaService {
  constructor(
    @Inject('RECEITAS')
    private receitaRepository: Repository<Receitas>,
  ) { }

  async retornaTodasReceitas(
    ano?: number,
    mes?: number,
    pago?: boolean | undefined,
    userId?: string,
  ): Promise<Receitas[]> {
    mes = mes ?? 0;
    ano = ano ?? 0;

    try {
      let receitas = await this.receitaRepository
        .createQueryBuilder('receitas')
        .select(select)
        .innerJoin('receitas.carteira', 'carteira')
        .innerJoin('receitas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(CriaWhereAno(ano))
        .andWhere(CriaWhereMes(mes))
        .andWhere(CriaWherePago(pago))
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
  ) {
    try {
      let receitas = await this.receitaRepository
        .createQueryBuilder('receitas')
        .select([
          'SUM(receitas.valor) valor',
          'carteira.descricao descricao',
          'carteira.id id',
        ])
        .innerJoin('receitas.carteira', 'carteira')
        .innerJoin('receitas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(CriaWhereAno(ano))
        .andWhere(CriaWhereMes(mes))
        .andWhere(CriaWherePago(pago))
        .groupBy('carteira.id')
        .orderBy('valor', 'DESC')
        .getRawMany();
      return receitas.map((receita) => {
        let valor = receita.valor ? parseFloat(receita.valor.toFixed(2)) : 0;
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
  ) {
    try {
      let { sum } = await this.receitaRepository
        .createQueryBuilder('receitas')
        .select('SUM(receitas.valor)', 'sum')
        .innerJoin('receitas.user', 'user')
        .where('user.id= :userId', { userId: userId })
        .andWhere(CriaWhereAno(ano))
        .andWhere(CriaWhereMes(mes))
        .andWhere(CriaWherePago(pago))
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

      const dateWhere = (ano: number) => Between(new Date(ano, 0, 1), new Date(ano, 11, 31));
      var where: { [k: string]: any } = {};

      if (ano) {
        //where.pagamento = dateWhere(ano)
      }
      if (userId) {
        where.user = {
          id: userId
        }
      }
      if (pago != null) {
        where.pago = pago
      }
      let receitas = await this.receitaRepository.find({
        relations: ['user', 'carteira'],
        where: where,
        order: { pagamento: 'ASC' },
      })

      let monthEarnings: { [key: string]: EarningsGroupMonthDTO<Receitas> } = {};

      receitas.forEach(element => {
        let key = String((element.pagamento).getFullYear()) + String("0" + (element.pagamento).getMonth()).slice(-2);

        if (key in monthEarnings) {
          monthEarnings[key].quantity++;
          monthEarnings[key].total += element.valor;
          if (element.pago) {
            monthEarnings[key].totalPayed += element.valor
          } else {
            monthEarnings[key].totalOpen += element.valor
          }
          monthEarnings[key].data.push(element)
        } else {
          monthEarnings[key] = new EarningsGroupMonthDTO(
            (element.pagamento).getMonth(),
            element.valor,
            (element.pago ? element.valor : 0),
            (element.pago ? 0 : element.valor),
            1,
            [element]);
        }

      });
      return monthEarnings
      // return monthEarnings.map((element) => {
      //   element.total = Math.round(element.total * 100) / 100;
      //   element.totalOpen = Math.round(element.totalOpen * 100) / 100;
      //   element.totalPayed = Math.round(element.totalPayed * 100) / 100;
      //   return element
      // })
    } catch (error) {
      throw new BadRequestException(
        error,
        YIELD_ERROR_MESSAGES.YIELD_SELECT_GROUP_MONTH_ERROR,
      );
    }
  }
  /**
   *
   * @param id
   * @returns Receitas
   */
  async getOne(id: number, userId?: string): Promise<Receitas> {
    try {
      const receita = await this.receitaRepository.findOneOrFail(
        { id },
        { relations: ['carteira', 'user'] },
      );

      if (userId && receita.user.id !== userId) {
        throw new UnauthorizedException(
          ERROR_MESSAGES.USER_TOKEN_NOT_EQUALS_TO_PARAM_URL,
        );
      }

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

  async alteraReceita(
    receitaDto: ReceitasDTO,
    id: number,
    userId: string,
  ): Promise<Receitas> {
    try {
      const receita = await this.getOne(id, userId);
      await this.receitaRepository.update({ id }, receitaDto);
      return receita;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraFlagPago(
    receitaDto,
    id: number,
    userId: string,
  ): Promise<Receitas> {
    try {
      const receita = await this.getOne(id, userId);
      await this.receitaRepository.update({ id }, receitaDto);
      return receita;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletaReceita(
    id: number,
    userId: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.getOne(id, userId);
      await this.receitaRepository.delete({ id });
      return { deleted: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
