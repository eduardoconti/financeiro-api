import { Test, TestingModule } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.ExpenseRepository,
          useValue: {
            findOneByParams: jest.fn(),
            delete: jest.fn(),
            findByParams: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteExpenseService,
          useClass: DeleteExpenseService,
        },
      ],
    }).compile();

    deleteExpenseService = module.get<DeleteExpenseService>(
      TYPES.DeleteExpenseService,
    );
    expenseRepository = module.get<IExpenseRepository>(TYPES.ExpenseRepository);
  });

  it('should be defined', () => {
    expect(deleteExpenseService).toBeDefined();
    expect(expenseRepository).toBeDefined();
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

    jest.spyOn(expenseRepository, 'deleteMany').mockResolvedValue({});

    const data = await deleteExpenseService.delete(
      mockExpenseInstalment.id as number,
      mockExpenseInstalment.userId,
    );

    expect(expenseRepository.findByParams).toBeCalledWith({
      instalmentId: mockExpenseInstalment.instalmentId,
    });
    expect(data).toBeDefined();
    expect(data).toEqual({ deleted: true });
    expect(expenseRepository.deleteMany).toBeCalledTimes(1);
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
