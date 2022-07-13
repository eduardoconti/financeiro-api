import { Injectable, Inject } from '@nestjs/common';

import { IGetCategoryService } from '@category/service';

import { IGetWalletService } from '@wallet/service';

import { TYPES } from '@config/dependency-injection';

import { EXPENSE_ERROR_MESSAGES } from '@expense/constants';
import { DespesasDTO, ExpensePatchFlagPayedDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import {
  ExpenseNotFoundException,
  UpdateExpenseException,
  UpdateInstalmentException,
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
  ) {}

  async update(
    id: number,
    userId: string,
    despesa: Partial<DespesasDTO>,
  ): Promise<Despesas> {
    const expense = await this.expenseRepository.findOneByParams({
      id,
      userId,
    });
    if (!expense) {
      throw new ExpenseNotFoundException();
    }

    if (expense.instalmentId) {
      throw new UpdateInstalmentException();
    }

    if (despesa.carteiraId) {
      await this.getWalletService.findOne(despesa.carteiraId, userId);
    }

    if (despesa.categoriaId) {
      await this.getCategoryService.findCategoryUserById(
        expense.categoriaId,
        userId,
      );
    }

    if (
      (despesa.pagamento && !despesa.pago) ||
      (!despesa.pagamento && despesa.pago)
    ) {
      throw new UpdateExpenseException(
        EXPENSE_ERROR_MESSAGES.UPDATE_EXPENSE_PAYMENT_DATE_AND_FALG_PAYED_ERROR,
      );
    }

    if (despesa.instalment !== expense.instalment) {
      throw new UpdateExpenseException(
        EXPENSE_ERROR_MESSAGES.UPDATE_INSTALMENT_NUMBER,
      );
    }

    return await this.expenseRepository.update(id, {
      ...despesa,
      updatedAt: DateHelper.dateNow(),
      pagamento: despesa.pagamento ?? expense.pagamento,
    });
  }

  async updateFlagPayed(
    id: number,
    userId: string,
    patchData: ExpensePatchFlagPayedDTO,
  ): Promise<Despesas> {
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
}
