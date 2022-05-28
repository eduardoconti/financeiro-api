import { Test } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { IDatabaseService } from '@db/services';

import { InsertExpenseException } from '@expense/exceptions';
import {
  buildExpenseEntityInstalment,
  descriptionOfInstalment,
} from '@expense/helpers';
import {
  fakeInsertExpenseRequest,
  fakeInsertExpenseRequestWithInstalment,
  mockExpenseEntity,
  mockExpenseInstalment,
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
  let databaseService: IDatabaseService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.ExpenseRepository,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.DatabaseService,
          useValue: {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            save: jest.fn(),
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
    databaseService = module.get<IDatabaseService>(TYPES.DatabaseService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(insertExpenseService).toBeDefined();
    expect(expenseRepository).toBeDefined();
    expect(databaseService).toBeDefined();
  });

  it('should insert a new expense', async () => {
    jest
      .spyOn(expenseRepository, 'insert')
      .mockResolvedValue(mockExpenseEntity);
    const data = await insertExpenseService.insert(
      fakeInsertExpenseRequest,
      fakeUserId,
    );

    expect(data).toBeDefined();
    expect(data).toEqual(mockExpenseEntity);
  });

  it('should insert a new expense with instalments', async () => {
    jest.spyOn(databaseService, 'connect').mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'startTransaction')
      .mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'save')
      .mockResolvedValue(mockExpenseInstalment);
    const data = await insertExpenseService.insert(
      fakeInsertExpenseRequestWithInstalment,
      fakeUserId,
    );

    expect(databaseService.connect).toHaveBeenCalledTimes(1);
    expect(databaseService.startTransaction).toHaveBeenCalledTimes(1);
    expect(databaseService.save).toHaveBeenCalledTimes(
      fakeInsertExpenseRequestWithInstalment.instalment,
    );
    expect(data).toBeDefined();
    expect(data).toEqual([
      {
        ...mockExpenseEntity,
        vencimento: fakeInsertExpenseRequestWithInstalment.vencimento,
        instalmentId: 'fakeid',
        descricao: descriptionOfInstalment(
          1,
          fakeInsertExpenseRequestWithInstalment.instalment,
          fakeInsertExpenseRequest.descricao,
        ),
      },
      mockExpenseInstalment,
    ]);
  });

  it('should insert a new expense with instalments and aply residual 0.01 for first instalment', async () => {
    jest.spyOn(databaseService, 'connect').mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'startTransaction')
      .mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'save')
      .mockResolvedValue(mockExpenseInstalment);
    const fakeRequest = {
      ...fakeInsertExpenseRequestWithInstalment,
      valor: 17.31,
    };
    const data = await insertExpenseService.insert(fakeRequest, fakeUserId);

    expect(databaseService.connect).toHaveBeenCalledTimes(1);
    expect(databaseService.startTransaction).toHaveBeenCalledTimes(1);
    expect(databaseService.save).toHaveBeenCalledTimes(2);
    expect(data).toBeDefined();
    expect(data).toEqual(
      buildExpenseEntityInstalment(fakeRequest, fakeUserId, 'fakeid'),
    );
  });

  it('should insert a new expense with instalments and aply residual 0.02 or more for 2 or more instalments', async () => {
    jest.spyOn(databaseService, 'connect').mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'startTransaction')
      .mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'save')
      .mockResolvedValue(mockExpenseInstalment);
    const fakeRequest = {
      ...fakeInsertExpenseRequestWithInstalment,
      valor: 6,
      instalment: 7,
    };
    const data = await insertExpenseService.insert(fakeRequest, fakeUserId);

    expect(databaseService.connect).toHaveBeenCalledTimes(1);
    expect(databaseService.startTransaction).toHaveBeenCalledTimes(1);
    expect(databaseService.save).toHaveBeenCalledTimes(fakeRequest.instalment);
    expect(data).toBeDefined();
    expect(data).toEqual(
      buildExpenseEntityInstalment(fakeRequest, fakeUserId, 'fakeid'),
    );
  });

  it('should throw InsertExpenseException and rollback transaction', async () => {
    jest.spyOn(databaseService, 'connect').mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'startTransaction')
      .mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'rollbackTransaction')
      .mockResolvedValue(undefined);
    jest.spyOn(databaseService, 'save').mockRejectedValueOnce(new Error());
    try {
      await insertExpenseService.insert(
        fakeInsertExpenseRequestWithInstalment,
        fakeUserId,
      );
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(InsertExpenseException);
      expect(databaseService.connect).toHaveBeenCalledTimes(1);
      expect(databaseService.startTransaction).toHaveBeenCalledTimes(1);
      expect(databaseService.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(databaseService.release).toHaveBeenCalledTimes(1);
      expect(databaseService.commitTransaction).not.toHaveBeenCalled();
    }
  });
});
