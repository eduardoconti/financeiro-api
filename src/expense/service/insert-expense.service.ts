import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ICategoryRepository } from '@category/repository';
import { ISubCategoryRepository } from '@category/repository/sub-category';

import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { EXPENSE_ERROR_MESSAGES } from '@expense/constants';
import { DespesasDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import { InsertExpenseException } from '@expense/exceptions';
import { buildExpenseEntityInstalment } from '@expense/helpers';
import { IExpenseRepository } from '@expense/repository';

import { DateHelper } from '@shared/helpers';

import { IInsertExpenseService } from './insert-expense.service.interface';

export class InsertExpenseService implements IInsertExpenseService {
  constructor(
    @Inject(TYPES.ExpenseRepository)
    private readonly expenseRepository: IExpenseRepository,
    @Inject(TYPES.WalletRepository)
    private walletRepository: IWalletRepository,
    @Inject(TYPES.CategoryRepository)
    private categoryRepository: ICategoryRepository,
    @Inject(TYPES.SubCategoryRepository)
    private getSubCategoryService: ISubCategoryRepository,
  ) {}

  async insert(
    expense: DespesasDTO,
    userId: string,
  ): Promise<Despesas | Despesas[]> {
    await Promise.all([
      this.walletRepository.exists({ id: expense.carteiraId, userId }),
      this.categoryRepository.exists({ id: expense.categoriaId, userId }),
      this.getSubCategoryService.exists({
        id: expense.subCategoryId,
        userId,
      }),
    ]);

    if (
      (expense.pagamento && !expense.pago) ||
      (!expense.pagamento && expense.pago)
    ) {
      throw new InsertExpenseException(
        EXPENSE_ERROR_MESSAGES.EXPENSE_PAYMENT_DATE_AND_FALG_PAYED_ERROR,
      );
    }
    if (expense.instalment === 1) {
      const entity = Despesas.build({
        ...expense,
        userId,
        createdAt: DateHelper.dateNow(),
      });

      return await this.expenseRepository.insert(entity);
    } else {
      return await this.insertInstalment(expense, userId);
    }
  }

  private async insertInstalment(
    expense: DespesasDTO,
    userId: string,
  ): Promise<Despesas[]> {
    const instalmentId = uuidv4();
    try {
      const expenses = buildExpenseEntityInstalment(
        expense,
        userId,
        instalmentId,
      );

      await this.expenseRepository.insertMany(expenses);

      const entitiesSaved = await this.expenseRepository.findByParams({
        instalmentId: instalmentId,
      });
      return entitiesSaved;
    } catch (e) {
      throw new InsertExpenseException(e);
    }
  }
}
