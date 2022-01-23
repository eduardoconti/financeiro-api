import {
  EarningDeleteResponseDTO,
  EarningsGroupMonthDTO,
  ReceitasDTO,
} from '@receitas/dto';
import { Receitas } from '@receitas/entity';

export interface IEarningService {
  retornaTodasReceitas(
    ano?: number,
    mes?: number,
    pago?: boolean | undefined,
    userId?: string,
  ): Promise<Receitas[]>;

  retornaValorReceitasAgrupadosPorCarteira(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<any[]>;

  retornaTotalReceitas(
    ano?: number,
    mes?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<number>;

  retornaReceitasAgrupadasPorMes(
    ano?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<{ [key: string]: EarningsGroupMonthDTO<Receitas> }>;

  getOne(id: number): Promise<Receitas>;

  insereReceita(receita: ReceitasDTO): Promise<Receitas>;

  alteraReceita(receitaDto: ReceitasDTO, id: number): Promise<Receitas>;

  alteraFlagPago(receitaDto: ReceitasDTO, id: number): Promise<Receitas>;

  deletaReceita(id: number): Promise<EarningDeleteResponseDTO>;
}
