import {
  EarningDeleteResponseDTO,
  EarningPatchFlagPayedDTO,
  EarningsGroupMonthDTO,
  GetTotalEarningResponseDTO,
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
    userId: string,
    ano?: number,
    mes?: number,
    pago?: boolean,
  ): Promise<GetTotalEarningResponseDTO>;

  retornaReceitasAgrupadasPorMes(
    ano?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<{ [key: string]: EarningsGroupMonthDTO<Receitas> }>;

  getOne(id: number): Promise<Receitas>;

  insereReceita(receita: ReceitasDTO): Promise<Receitas>;

  alteraReceita(receitaDto: ReceitasDTO, id: number): Promise<Receitas>;

  alteraFlagPago(
    receitaDto: EarningPatchFlagPayedDTO,
    id: number,
  ): Promise<Receitas>;

  deletaReceita(id: number): Promise<EarningDeleteResponseDTO>;
}
