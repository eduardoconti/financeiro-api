import { Test } from '@nestjs/testing';

import { ICategoryRepository } from '@category/repository';
import { ISubCategoryRepository } from '@category/repository/sub-category';

import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { Despesas } from '@expense/entity';
import { InsertExpenseException } from '@expense/exceptions';
import { buildExpenseEntityInstalment } from '@expense/helpers';
import {
  fakeInsertExpenseRequest,
  fakeInsertExpenseRequestWithInstalment,
  mockExpenseEntity,
} from '@expense/mocks';
import { IExpenseRepository } from '@expense/repository';

import { InsertExpenseService } from './insert-expense.service';
import { IInsertExpenseService } from './insert-expense.service.interface';

const fakeUserId = '6fdeff33-a45d-4e51-b6f0-b7e695f72089';

jest.mock('uuid', () => ({
  v4: () => 'fakeid',
}));

jest.mock('@shared/helpers', () => ({
  DateHelper: {
    dateNow: () => new Date('2022-05-26T18:59:18.026Z'),
    addMonth: () => new Date('2022-05-26T18:59:18.026Z'),
  },
}));

describe('InsertExpenseService', () => {
  let insertExpenseService: IInsertExpenseService;
  let expenseRepository: IExpenseRepository;
  let walletRepository: IWalletRepository;
  let categoryRepository: ICategoryRepository;
  let subCategoryRepository: ISubCategoryRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.ExpenseRepository,
          useValue: {
            insert: jest.fn(),
            findByParams: jest.fn(),
            insertMany: jest.fn(),
          },
        },
        {
          provide: TYPES.CategoryRepository,
          useValue: {
            exists: jest.fn(),
          },
        },
        {
          provide: TYPES.SubCategoryRepository,
          useValue: {
            exists: jest.fn(),
          },
        },
        {
          provide: TYPES.WalletRepository,
          useValue: {
            exists: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertExpenseService,
          useClass: InsertExpenseService,
        },
      ],
    }).compile();

    insertExpenseService = module.get<IInsertExpenseService>(
      TYPES.InsertExpenseService,
    );
    expenseRepository = module.get<IExpenseRepository>(TYPES.ExpenseRepository);
    walletRepository = module.get<IWalletRepository>(TYPES.WalletRepository);
    categoryRepository = module.get<ICategoryRepository>(
      TYPES.CategoryRepository,
    );
    subCategoryRepository = module.get<ISubCategoryRepository>(
      TYPES.SubCategoryRepository,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(insertExpenseService).toBeDefined();
    expect(expenseRepository).toBeDefined();
    expect(walletRepository).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(subCategoryRepository).toBeDefined();
  });

  it('should insert a new expense', async () => {
    jest.spyOn(walletRepository, 'exists').mockResolvedValue(true);
    jest.spyOn(categoryRepository, 'exists').mockResolvedValue(true);
    jest.spyOn(subCategoryRepository, 'exists').mockResolvedValue(true);
    jest
      .spyOn(expenseRepository, 'insert')
      .mockResolvedValue(mockExpenseEntity);
    const data = await insertExpenseService.insert(
      fakeInsertExpenseRequest,
      fakeUserId,
    );

    expect(data).toBeDefined();
    expect(data).toEqual(mockExpenseEntity);
    expect((data as Despesas).valor).toBe(100);
  });

  it('should insert a new expense with instalments', async () => {
    const entity = buildExpenseEntityInstalment(
      fakeInsertExpenseRequestWithInstalment,
      fakeUserId,
      'fakeid',
    );
    jest.spyOn(expenseRepository, 'insertMany').mockResolvedValue(entity);

    jest.spyOn(expenseRepository, 'findByParams').mockResolvedValue(entity);
    const data = await insertExpenseService.insert(
      fakeInsertExpenseRequestWithInstalment,
      fakeUserId,
    );

    expect(data).toBeDefined();
    expect(data).toEqual(entity);
    expect(data).toHaveLength(
      fakeInsertExpenseRequestWithInstalment.instalment,
    );
  });

  it('should insert a new expense with instalments and aply residual 1 for first instalment', async () => {
    const fakeRequest = {
      ...fakeInsertExpenseRequestWithInstalment,
      valor: 5,
    };
    const entities = buildExpenseEntityInstalment(
      fakeRequest,
      fakeUserId,
      'fakeid',
    );

    jest.spyOn(expenseRepository, 'insertMany').mockResolvedValueOnce(entities);

    jest.spyOn(expenseRepository, 'findByParams').mockResolvedValue(entities);

    const data = await insertExpenseService.insert(fakeRequest, fakeUserId);

    expect(data).toBeDefined();
    expect(data).toEqual(entities);
    expect(data).toHaveLength(fakeRequest.instalment);
  });

  it('should insert a new expense with instalments and aply residual 2 or more for 2 instalments', async () => {
    const fakeRequest = {
      ...fakeInsertExpenseRequestWithInstalment,
      valor: 14,
      instalment: 4,
    };
    const entities = buildExpenseEntityInstalment(
      fakeRequest,
      fakeUserId,
      'fakeid',
    );

    jest.spyOn(expenseRepository, 'insertMany').mockResolvedValueOnce(entities);

    jest.spyOn(expenseRepository, 'findByParams').mockResolvedValue(entities);

    const data = await insertExpenseService.insert(fakeRequest, fakeUserId);

    expect(data).toBeDefined();
    expect(data).toEqual(entities);
    expect(data).toHaveLength(fakeRequest.instalment);
    expect((data as Despesas[])[2].valor).toBeLessThan(
      (data as Despesas[])[0].valor,
    );
  });
  it('should insert a new expense with instalments and aply residual 3 or more for 3 instalments', async () => {
    const fakeRequest = {
      ...fakeInsertExpenseRequestWithInstalment,
      valor: 13,
      instalment: 5,
    };
    const entities = buildExpenseEntityInstalment(
      fakeRequest,
      fakeUserId,
      'fakeid',
    );

    jest.spyOn(expenseRepository, 'insertMany').mockResolvedValueOnce(entities);

    jest.spyOn(expenseRepository, 'findByParams').mockResolvedValue(entities);

    const data = await insertExpenseService.insert(fakeRequest, fakeUserId);

    expect(data).toBeDefined();
    expect(data).toEqual(entities);
    expect(data).toHaveLength(fakeRequest.instalment);
    expect((data as Despesas[])[3].valor).toBeLessThan(
      (data as Despesas[])[0].valor,
    );
  });

  it('should throw InsertExpenseException and rollback transaction', async () => {
    jest
      .spyOn(expenseRepository, 'insertMany')
      .mockRejectedValueOnce(new Error());
    try {
      await insertExpenseService.insert(
        fakeInsertExpenseRequestWithInstalment,
        fakeUserId,
      );
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(InsertExpenseException);
    }
  });

  it('should throw InsertExpenseException when payment date and flag not payed', async () => {
    jest.spyOn(walletRepository, 'exists').mockResolvedValue(true);
    jest.spyOn(categoryRepository, 'exists').mockResolvedValue(true);
    jest.spyOn(subCategoryRepository, 'exists').mockResolvedValue(true);
    await expect(
      insertExpenseService.insert(
        {
          ...fakeInsertExpenseRequest,
          pagamento: new Date('2022-05-26T18:59:18.026Z'),
          pago: false,
        },
        mockExpenseEntity.userId,
      ),
    ).rejects.toThrowError(InsertExpenseException);
  });

  it('should throw InsertExpenseException when not payment date and flag payed', async () => {
    jest.spyOn(walletRepository, 'exists').mockResolvedValue(true);
    jest.spyOn(categoryRepository, 'exists').mockResolvedValue(true);
    jest.spyOn(subCategoryRepository, 'exists').mockResolvedValue(true);
    await expect(
      insertExpenseService.insert(
        {
          ...fakeInsertExpenseRequest,
          pago: true,
        },
        mockExpenseEntity.userId,
      ),
    ).rejects.toThrowError(InsertExpenseException);
  });
});
