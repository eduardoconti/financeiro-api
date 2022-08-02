import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { IGetCategoryService } from '@category/service';
import { IGetSubCategoryService } from '@category/service/sub-category';

import { IGetWalletService } from '@wallet/service';

import { TYPES } from '@config/dependency-injection';

import { IDatabaseService } from '@db/services';

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
    @Inject(TYPES.DatabaseService)
    private readonly databaseService: IDatabaseService,
    @Inject(TYPES.GetWalletService)
    private getWalletService: IGetWalletService,
    @Inject(TYPES.GetCategoryService)
    private getCategoryService: IGetCategoryService,
    @Inject(TYPES.GetSubCategoryService)
    private getSubCategoryService: IGetSubCategoryService,
  ) {}

  async insert(
    expense: DespesasDTO,
    userId: string,
  ): Promise<Despesas | Despesas[]> {
    await this.getWalletService.findOne(expense.carteiraId, userId);
    await this.getCategoryService.findCategoryUserById(
      expense.categoriaId,
      userId,
    );
    await this.getSubCategoryService.findSubCategoryUserById(
      expense.subCategoryId,
      userId,
    );
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
      await this.databaseService.connect();
      await this.databaseService.startTransaction();
      const expenses = buildExpenseEntityInstalment(
        expense,
        userId,
        instalmentId,
      );
      const entitiesSaved = [];

      for (const entity of expenses) {
        const entitySaved = await this.databaseService.save(entity);
        entitiesSaved.push(entitySaved);
      }
      await this.databaseService.commitTransaction();
      return entitiesSaved;
    } catch (e) {
      await this.databaseService.rollbackTransaction();
      throw new InsertExpenseException(e);
    } finally {
      await this.databaseService.release();
    }
  }
}
