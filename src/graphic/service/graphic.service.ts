import 'moment/locale/pt-br';
import { Inject, Injectable } from '@nestjs/common';
import moment from 'moment';

import { EarningsGroupMonthDTO } from '@earning/dto';
import { IGetEarningService } from '@earning/service';

import { TYPES } from '@config/dependency-injection';

import { ExpensesGroupMonthDTO } from '@expense/dto';
import { IGetExpenseService } from '@expense/service';
import { ExpenseGroupMonth } from '@expense/types';

import {
  GeneralGraphicDataDTO,
  GeneralGraphicResponseDataDTO,
  GeneralGraphicResponseDTO,
  GeneralUnplannedDTO,
  UnplannedExpensesResponseDTO,
} from '@graphic/dto/general-graphic';

import { IGraphicService } from './graphic.service.interface';

@Injectable()
export class GraphicService implements IGraphicService {
  constructor(
    @Inject(TYPES.GetExpenseService)
    private getExpenseService: IGetExpenseService,
    @Inject(TYPES.GetEarningService)
    private getEarningService: IGetEarningService,
  ) {}
  async generalGraphic(userId: string): Promise<GeneralGraphicResponseDTO> {
    const despesas = await this.getExpenseService.getExpensesGroupByMonth(
      userId,
    );
    const receitas = await this.getEarningService.getEarningsGroupByMonth(
      userId,
    );
    const graphicData: GeneralGraphicResponseDTO =
      new GeneralGraphicResponseDTO();

    let totalBallance = 0;

    const expensesProperties = Object.getOwnPropertyNames(despesas);
    const receitasProperties = Object.getOwnPropertyNames(receitas);
    const properties = [
      ...new Set([...expensesProperties, ...receitasProperties]),
    ].sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));

    properties.forEach((key) => {
      receitas[key] ??
        (receitas[key] = new EarningsGroupMonthDTO(despesas[key].month, []));

      despesas[key] ??
        (despesas[key] = new ExpensesGroupMonthDTO(receitas[key].month, []));

      const ballance = receitas[key].total - despesas[key].total;

      const earnings = GeneralGraphicDataDTO.build({
        quantity: receitas[key].quantity,
        total: receitas[key].total,
        totalOpen: receitas[key].totalOpen,
        totalPayed: receitas[key].totalPayed,
      });

      const expenses = GeneralGraphicDataDTO.build({
        quantity: despesas[key].quantity,
        total: despesas[key].total,
        totalOpen: despesas[key].totalOpen,
        totalPayed: despesas[key].totalPayed,
      });

      totalBallance += ballance;

      graphicData.geral.earnings.quantity += earnings.quantity;
      graphicData.geral.earnings.total += earnings.total;
      graphicData.geral.earnings.totalOpen += earnings.totalOpen;
      graphicData.geral.earnings.totalPayed += earnings.totalPayed;

      graphicData.geral.expenses.quantity += expenses.quantity;
      graphicData.geral.expenses.total += expenses.total;
      graphicData.geral.expenses.totalOpen += expenses.totalOpen;
      graphicData.geral.expenses.totalPayed += expenses.totalPayed;

      graphicData.months.push(
        GeneralGraphicResponseDataDTO.build({
          month: this.getMonthName(key),
          earnings,
          expenses,
          ballance,
          totalBallance,
        }),
      );
    });

    return graphicData;
  }

  async unplannedExpenses(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<UnplannedExpensesResponseDTO> {
    const data: ExpenseGroupMonth =
      await this.getExpenseService.getUnplannedExpenses(userId, start, end);
    const generalUnplannedDTO = new GeneralUnplannedDTO();
    const response = new UnplannedExpensesResponseDTO();
    Object.getOwnPropertyNames(data).forEach((key) => {
      const { total, totalOpen, totalPayed, quantity } = data[key];
      generalUnplannedDTO.sum({
        total,
        totalOpen,
        totalPayed,
        quantity,
      });
      response.addMonth({
        ...data[key],
        month: this.getMonthName(key),
      });
    });

    response.setGeral(generalUnplannedDTO);
    return response;
  }
  private getMonthName(yearMonth: string): string {
    moment().locale('pb-br');
    const dateString = this.createDate(yearMonth);
    return moment(dateString).format('YYYY[-]MMM');
  }
  private createDate(str: string): string {
    return str.substr(0, 4) + '-' + str.substr(4) + '-01';
  }
}
