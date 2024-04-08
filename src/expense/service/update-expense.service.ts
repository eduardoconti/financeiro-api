import { Injectable, Inject } from '@nestjs/common';

import { IGetCategoryService } from '@category/service';

import { IGetWalletService } from '@wallet/service';

import { TYPES } from '@config/dependency-injection';
import { BaseException } from '@config/exceptions';

import { IDatabaseService } from '@db/services';

import { EXPENSE_ERROR_MESSAGES } from '@expense/constants';
import { DespesasDTO, ExpensePatchFlagPayedDTO } from '@expense/dto';
import { Despesa } from '@expense/entity';
import {
  ExpenseNotFoundException,
  UpdateExpenseException,
  //UpdateInstalmentException,
} from '@expense/exceptions';
import { IExpenseRepository } from '@expense/repository';

import { DateHelper } from '@shared/helpers';

import { IUpdateExpenseService } from './update-expense.service.interface';

@Injectable()
export class UpdateExpenseService implements IUpdateExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private expenseRepository: IExpenseRepository,
    @Inject(TYPES.GetWalletService)
    private getWalletService: IGetWalletService,
    @Inject(TYPES.GetCategoryService)
    private getCategoryService: IGetCategoryService,
    @Inject(TYPES.DatabaseService)
    private readonly databaseService: IDatabaseService,
  ) {}

  async update(
    id: number,
    userId: string,
    despesa: Partial<DespesasDTO>,
  ): Promise<Despesa> {
    const expense = await this.expenseRepository.findOneByParams({
      id,
      userId,
    });

    if (!expense) {
      throw new ExpenseNotFoundException();
    }

    if (despesa.carteiraId) {
      await this.getWalletService.findOne(despesa.carteiraId, userId);
    }

    if (despesa.categoriaId) {
      await this.getCategoryService.findOne(expense.categoriaId, userId);
    }

    if (
      (despesa.pagamento && !despesa.pago) ||
      (!despesa.pagamento && despesa.pago)
    ) {
      throw new UpdateExpenseException(
        EXPENSE_ERROR_MESSAGES.EXPENSE_PAYMENT_DATE_AND_FALG_PAYED_ERROR,
      );
    }

    if (despesa.instalment !== expense.instalment) {
      throw new UpdateExpenseException(
        EXPENSE_ERROR_MESSAGES.UPDATE_INSTALMENT_NUMBER,
      );
    }

    return await this.expenseRepository.update(id, {
      ...despesa,
      updatedAt:
        expense.valor !== despesa.valor
          ? DateHelper.dateNow()
          : expense.updatedAt,
      pagamento: despesa.pagamento ?? expense.pagamento,
    });
  }

  async updateFlagPayed(
    id: number,
    userId: string,
    patchData: ExpensePatchFlagPayedDTO,
  ): Promise<Despesa> {
    const expense = await this.expenseRepository.findOneByParams({
      id,
      userId,
    });
    if (!expense) {
      throw new ExpenseNotFoundException();
    }
    if (expense.pago !== patchData.pago) {
      return await this.expenseRepository.update(id, {
        ...patchData,
        pagamento: patchData.pago ? DateHelper.dateNow() : undefined,
      });
    }

    return expense;
  }

  async updateInstalment(
    userId: string,
    instalmentId: string,
    despesa: Partial<DespesasDTO>,
    id: number,
  ) {
    try {
      const expenses = await this.expenseRepository.findByParams({
        userId: userId,
        instalmentId: instalmentId,
      });

      expenses.forEach((e) => {
        if (despesa.categoriaId) {
          e.categoriaId = despesa.categoriaId;
          e.categoria = undefined;
        }

        if (despesa.subCategoryId) {
          e.subCategoryId = despesa.subCategoryId;
          e.subCategory = undefined;
        }

        if (despesa.carteiraId) {
          if (!e.pago) {
            e.carteiraId = despesa.carteiraId;
            e.carteira = undefined;
          }
        }
      });

      await this.databaseService.save(expenses);

      return (await this.expenseRepository.findOneByParams({ id })) as Despesa;
    } catch (e: any) {
      if (e instanceof BaseException) {
        throw e;
      }
      throw new UpdateExpenseException(e.message);
    }
  }
}
