import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { TYPES } from '@config/dependency-injection';
import { InternalServerErrorException as FCInternalServerErrorException } from '@config/exceptions';

import { EXPENSE_ERROR_MESSAGES } from '@despesas/constants';
import { DespesasDTO, ExpensePatchFlagPayedDTO } from '@despesas/dto';
import { ExpenseDeletedResponse } from '@despesas/interface';

import { SqlFileManager } from '@shared/helpers';

import { ExpensesGroupMonthDTO } from '../dto/expenses-group-month-response.dto';
import { Despesas } from '../entity/despesas.entity';
import { IExpenseService } from './expense.service.interface';

export type ExpenseGroupMonth = {
  [key: string]: ExpensesGroupMonthDTO;
};

@Injectable()
export class DespesaService implements IExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private despesaRepository: Repository<Despesas>,
  ) {}

  async retornaDespesasAgrupadasPorMes(
    ano?: number,
    pago?: boolean,
    userId?: string,
  ): Promise<{ [k: string]: ExpensesGroupMonthDTO }> {
    try {
      const sqlString = SqlFileManager.readFile(
        __dirname,
        'get-expense-group-by-month.sql',
      );

      const despesas: [] = await this.despesaRepository.query(sqlString, [
        userId,
      ]);

      const monthExpenses: ExpenseGroupMonth = {};

      despesas.forEach(
        (element: { month: string; data: ExpensesGroupMonthDTO }) => {
          const { ...atributes }: ExpensesGroupMonthDTO = element.data;
          monthExpenses[element.month] = ExpensesGroupMonthDTO.build({
            ...atributes,
          });
        },
      );

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
      const entity = new Despesas();
      entity.userId = despesa.userId;
      entity.carteiraId = despesa.carteiraId;
      entity.categoriaId = despesa.categoriaId;
      entity.pagamento = despesa.pagamento as Date;
      entity.valor = despesa.valor;
      entity.vencimento = despesa.vencimento;
      entity.descricao = despesa.descricao;

      const newDespesas = this.despesaRepository.create(entity);
      await this.despesaRepository.save(newDespesas);
      return newDespesas;
    } catch (error) {
      throw new FCInternalServerErrorException(
        undefined,
        EXPENSE_ERROR_MESSAGES.EXPENSE_CREATE_ERROR,
        error,
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
