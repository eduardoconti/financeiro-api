import { UpdateExpenseException } from './../exceptions/update-expense.exception';
import { Injectable, Inject } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { DespesasDTO, ExpensePatchFlagPayedDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import {
  ExpenseNotFoundException,
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

    if (despesa.pagamento && !despesa.pago) {
      despesa.pago = true;
    }

    return await this.expenseRepository.update(id, {
      ...despesa,
      updatedAt: DateHelper.dateNow(),
      pagamento:
        despesa.pagamento ?? despesa.pago ? DateHelper.dateNow() : undefined,
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
