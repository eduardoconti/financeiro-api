import { GeneralGraphicResponseDataDTO } from './../dto/general-graphic/general-graphic-response-data.dto';
import { GeneralGraphicResponseDTO } from './../dto/general-graphic/general-graphic-response.dto';

import { Injectable } from '@nestjs/common';
import { GeneralGraphicDataDTO } from '../dto/general-graphic';
import { ReceitaService } from '@receitas/service';
import { DespesaService } from '@despesas/service';


@Injectable()
export class GraphicService {
    constructor(
        private despesasService: DespesaService,
        private receitasService: ReceitaService) { }
    async generalGraphic(userId: string, pago?: boolean): Promise<GeneralGraphicResponseDTO> {
        let despesas = await this.despesasService.retornaDespesasAgrupadasPorMes(null, pago, userId);
        let receitas = await this.receitasService.retornaReceitasAgrupadasPorMes(null, pago, userId);
        let graphicData: GeneralGraphicResponseDTO = new GeneralGraphicResponseDTO()

        let totalBallance = 0;

        Object.getOwnPropertyNames(despesas).forEach(key => {
            let ballance = receitas[key].total - despesas[key].total;

            let earnings = GeneralGraphicDataDTO.build({
                quantity: receitas[key].quantity,
                total: receitas[key].total,
                totalOpen: receitas[key].totalOpen,
                totalPayed: receitas[key].totalPayed
            })

            let expenses = GeneralGraphicDataDTO.build({
                quantity: despesas[key].quantity,
                total: despesas[key].total,
                totalOpen: despesas[key].totalOpen,
                totalPayed: despesas[key].totalPayed
            })

            totalBallance += ballance;

            graphicData.geral.earnings.quantity += earnings.quantity
            graphicData.geral.earnings.total += earnings.total
            graphicData.geral.earnings.totalOpen += earnings.totalOpen
            graphicData.geral.earnings.totalPayed += earnings.totalPayed

            graphicData.geral.expenses.quantity += expenses.quantity
            graphicData.geral.expenses.total += expenses.total
            graphicData.geral.expenses.totalOpen += expenses.totalOpen
            graphicData.geral.expenses.totalPayed += earnings.totalPayed

            graphicData.months.push(GeneralGraphicResponseDataDTO.build({
                month: this.getMonthName(key),
                earnings: earnings,
                expenses: expenses,
                ballance: ballance,
                totalBallance: totalBallance
            }))
        });

        return graphicData
    }

    private getMonthName(yearMonth: string): string {
        switch (yearMonth.slice(4)) {
            case '00':
                return this.getYear(yearMonth) + '-' + 'Jan'
            case '01':
                return this.getYear(yearMonth) + '-' + 'Fev'
            case '02':
                return this.getYear(yearMonth) + '-' + 'Mar'
            case '03':
                return this.getYear(yearMonth) + '-' + 'Abr'
            case '04':
                return this.getYear(yearMonth) + '-' + 'Mai'
            case '05':
                return this.getYear(yearMonth) + '-' + 'Jun'
            case '06':
                return this.getYear(yearMonth) + '-' + 'Jul'
            case '07':
                return this.getYear(yearMonth) + '-' + 'Ago'
            case '08':
                return this.getYear(yearMonth) + '-' + 'Set'
            case '09':
                return this.getYear(yearMonth) + '-' + 'Out'
            case '10':
                return this.getYear(yearMonth) + '-' + 'Nov'
            case '11':
                return this.getYear(yearMonth) + '-' + 'Dez'
        }
    }

    private getYear(yearMonth: string) {
        return yearMonth.slice(0, 4)
    }
}
