import { Test, TestingModule } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { IDatabaseService } from '@db/services';

import {
  DeleteExpenseException,
  ExpenseNotFoundException,
} from '@expense/exceptions';
import { mockExpenseEntity, mockExpenseInstalment } from '@expense/mocks';
import { IExpenseRepository } from '@expense/repository';

import { IDeleteExpenseService } from '.';
import { DeleteExpenseService } from './delete-expense.service';

describe('DeleteExpenseService', () => {
  let deleteExpenseService: IDeleteExpenseService;
  let expenseRepository: IExpenseRepository;
  let databaseService: IDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.ExpenseRepository,
          useValue: {
            findOneByParams: jest.fn(),
            delete: jest.fn(),
            findByParams: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteExpenseService,
          useClass: DeleteExpenseService,
        },
        {
          provide: TYPES.DatabaseService,
          useValue: {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteExpenseService = module.get<DeleteExpenseService>(
      TYPES.DeleteExpenseService,
    );
    expenseRepository = module.get<IExpenseRepository>(TYPES.ExpenseRepository);
    databaseService = module.get<IDatabaseService>(TYPES.DatabaseService);
  });

  it('should be defined', () => {
    expect(deleteExpenseService).toBeDefined();
    expect(expenseRepository).toBeDefined();
    expect(databaseService).toBeDefined();
  });

  it('should delete an expense', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseEntity);
    jest
      .spyOn(expenseRepository, 'delete')
      .mockResolvedValue({ deleted: true });

    const data = await deleteExpenseService.delete(
      mockExpenseEntity.id as number,
      mockExpenseEntity.userId,
    );

    expect(data).toBeDefined();
    expect(data).toEqual({ deleted: true });
  });
  it('should delete an expense with instalment', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseInstalment);
    jest
      .spyOn(expenseRepository, 'findByParams')
      .mockResolvedValue([mockExpenseInstalment, mockExpenseInstalment]);
    jest.spyOn(databaseService, 'connect').mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'startTransaction')
      .mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'delete')
      .mockResolvedValue(mockExpenseInstalment);
    jest
      .spyOn(databaseService, 'commitTransaction')
      .mockResolvedValue(undefined);
    jest.spyOn(databaseService, 'release').mockResolvedValue(undefined);

    const data = await deleteExpenseService.delete(
      mockExpenseInstalment.id as number,
      mockExpenseInstalment.userId,
    );

    expect(expenseRepository.findByParams).toBeCalledWith({
      instalmentId: mockExpenseInstalment.instalmentId,
    });
    expect(data).toBeDefined();
    expect(data).toEqual({ deleted: true });
    expect(databaseService.startTransaction).toBeCalledTimes(1);
    expect(databaseService.delete).toBeCalledTimes(
      mockExpenseInstalment.instalment,
    );
    expect(databaseService.commitTransaction).toBeCalledTimes(1);
    expect(databaseService.release).toBeCalledTimes(1);
    expect(databaseService.rollbackTransaction).toBeCalledTimes(0);
  });

  it('should throw error when delete an expense with instalment and rollback', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseInstalment);
    jest
      .spyOn(expenseRepository, 'findByParams')
      .mockResolvedValue([mockExpenseInstalment, mockExpenseInstalment]);
    jest.spyOn(databaseService, 'connect').mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'startTransaction')
      .mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'delete')
      .mockResolvedValue(mockExpenseInstalment);
    jest
      .spyOn(databaseService, 'commitTransaction')
      .mockRejectedValue(undefined);
    jest.spyOn(databaseService, 'release').mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'rollbackTransaction')
      .mockResolvedValue(undefined);

    try {
      await deleteExpenseService.delete(
        mockExpenseInstalment.id as number,
        mockExpenseInstalment.userId,
      );
    } catch (error) {
      expect(databaseService.startTransaction).toBeCalledTimes(1);
      expect(databaseService.delete).toBeCalledTimes(
        mockExpenseInstalment.instalment,
      );
      expect(databaseService.rollbackTransaction).toBeCalledTimes(1);
    } finally {
      expect(databaseService.release).toBeCalledTimes(1);
    }
  });

  it('should throw ExpenseNotFoundException when findOneByParams is null', async () => {
    jest.spyOn(expenseRepository, 'findOneByParams').mockResolvedValue(null);
    expect(deleteExpenseService.delete(1, '1')).rejects.toThrow(
      ExpenseNotFoundException,
    );
  });

  it('should throw DeleteExpenseException when findOneByParams failed', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockRejectedValue(new DeleteExpenseException());
    expect(deleteExpenseService.delete(1, '1')).rejects.toThrow(
      DeleteExpenseException,
    );
  });
});
