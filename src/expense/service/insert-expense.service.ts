import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ICategoryRepository } from '@category/repository';
import { ISubCategoryRepository } from '@category/repository/sub-category';

import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { EXPENSE_ERROR_MESSAGES } from '@expense/constants';
import { DespesasDTO } from '@expense/dto';
import { Despesa } from '@expense/entity';
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
    private subCategoryService: ISubCategoryRepository,
  ) {}

  async insert(
    expense: DespesasDTO,
    userId: string,
  ): Promise<Despesa | Despesa[]> {
    await Promise.all([
      this.walletRepository.exists({ id: expense.carteiraId, userId }),
      this.categoryRepository.exists({ id: expense.categoriaId, userId }),
      this.subCategoryService.exists({
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
      const entity = Despesa.build({
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
  ): Promise<Despesa[]> {
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
