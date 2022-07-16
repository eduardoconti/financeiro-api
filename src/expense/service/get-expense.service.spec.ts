import { Test, TestingModule } from '@nestjs/testing';
import { Between } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import {
  ExpensesGroupMonthDTO,
  GetExpenseAmountGroupByCategoryResponse,
  GetExpenseAmountGroupByWalletResponse,
} from '@expense/dto';
import { ExpenseNotFoundException } from '@expense/exceptions';
import { buildParams } from '@expense/helpers';
import { mockExpenseEntity } from '@expense/mocks';
import { IExpenseRepository } from '@expense/repository';

import { DateHelper } from '@shared/helpers';

import { GetExpenseService } from './get-expense.service';
import { IGetExpenseService } from './get-expense.service.interface';

const userId = '6fdeff33-a45d-4e51-b6f0-b7e695f72089';
const start = '2020-01-01';
const end = '2020-01-31';
const pago = true;
jest.mock('@shared/helpers', () => ({
  DateHelper: {
    dateNow: () => new Date('2022-05-26T18:59:18.026Z'),
    addMonth: () => new Date('2022-05-26T18:59:18.026Z'),
    date: () => new Date('2022-05-26T18:59:18.026Z'),
  },
  SqlFileManager: {
    readFile: () => 'select * from expense',
  },
  OrmHelper: {
    buildDateWhere: () => Between(DateHelper.date(start), DateHelper.date(end)),
  },
}));
describe('GetExpenseService', () => {
  let getExpenseService: IGetExpenseService;
  let expenseRepository: IExpenseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.ExpenseRepository,
          useValue: {
            findByParams: jest.fn(),
            query: jest.fn(),
            findOneByParams: jest.fn(),
          },
        },
        {
          provide: TYPES.GetExpenseService,
          useClass: GetExpenseService,
        },
      ],
    }).compile();

    getExpenseService = module.get<GetExpenseService>(TYPES.GetExpenseService);
    expenseRepository = module.get<IExpenseRepository>(TYPES.ExpenseRepository);
  });

  it('should be defined', () => {
    expect(getExpenseService).toBeDefined();
    expect(expenseRepository).toBeDefined();
  });
  it('should be able to getAllExpensesByUser', async () => {
    jest
      .spyOn(expenseRepository, 'findByParams')
      .mockResolvedValue([mockExpenseEntity]);
    const [data] = await getExpenseService.getAllExpensesByUser(userId, {
      start,
      end,
      pago,
    });
    expect(data).toBeDefined();
    expect(data).toEqual(mockExpenseEntity);
    expect(expenseRepository.findByParams).toHaveBeenCalledWith(
      buildParams(userId, { start, end, pago }),
    );
    expect(data.userId).toEqual(userId);
  });

  it('should be able to getAllExpensesByUser by params without start date', async () => {
    jest
      .spyOn(expenseRepository, 'findByParams')
      .mockResolvedValue([mockExpenseEntity]);
    const [data] = await getExpenseService.getAllExpensesByUser(userId, {
      end,
      pago,
    });
    expect(data).toBeDefined();
    expect(data).toEqual(mockExpenseEntity);
    expect(expenseRepository.findByParams).toHaveBeenCalledWith(
      buildParams(userId, { end, pago }),
    );
    expect(data.userId).toEqual(userId);
  });

  it('should be able to getExpensesGroupByMonth', async () => {
    jest.spyOn(expenseRepository, 'query').mockResolvedValue([
      {
        month: '2020-01',
        data: new ExpensesGroupMonthDTO(1, [mockExpenseEntity]),
      },
    ]);

    const data = await getExpenseService.getExpensesGroupByMonth(
      userId,
      start,
      end,
    );
    expect(data).toBeDefined();
    expect(expenseRepository.query).toHaveBeenCalledWith(
      'select * from expense',
      [userId, start, end],
    );
  });

  it('should be able to getExpenseValuesGroupByWallet', async () => {
    const fake = GetExpenseAmountGroupByWalletResponse.build({
      id: 1,
      valor: 1,
      descricao: 'teste',
    });
    jest.spyOn(expenseRepository, 'query').mockResolvedValue([fake]);

    const data = await getExpenseService.getExpenseValuesGroupByWallet(
      userId,
      start,
      end,
    );
    expect(data).toBeDefined();
    expect(expenseRepository.query).toHaveBeenCalledWith(
      'select * from expense',
      [userId, start, end, undefined],
    );
  });

  it('should be able to getExpenseValuesGroupByCategory', async () => {
    const fake = GetExpenseAmountGroupByCategoryResponse.build({
      id: 1,
      valor: 1,
      descricao: 'teste',
    });
    jest.spyOn(expenseRepository, 'query').mockResolvedValue([fake]);

    const data = await getExpenseService.getExpenseValuesGroupByCategory(
      userId,
      start,
      end,
    );
    expect(data).toBeDefined();
    expect(expenseRepository.query).toHaveBeenCalledWith(
      'select * from expense',
      [userId, start, end, undefined],
    );
  });

  it('should be able to getTotalExpenses', async () => {
    jest.spyOn(expenseRepository, 'query').mockResolvedValue([
      {
        total: 100,
      },
    ]);

    const data = await getExpenseService.getTotalExpenses(userId, start, end);
    expect(data).toBeDefined();
    expect(expenseRepository.query).toHaveBeenCalledWith(
      'select * from expense',
      [userId, start, end],
    );
  });

  it('should be able findOne', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseEntity);

    const data = await getExpenseService.findOne({ userId });
    expect(data).toBeDefined();
    expect(expenseRepository.findOneByParams).toHaveBeenCalledWith({ userId });
  });

  it('should throw ExpenseNotFoundException', async () => {
    jest.spyOn(expenseRepository, 'findOneByParams').mockResolvedValue(null);

    expect(getExpenseService.findOne({ userId })).rejects.toThrowError();
    expect(expenseRepository.findOneByParams).toHaveBeenCalledWith({ userId });
  });

  it('should be able to getUnplannedExpenses', async () => {
    const mock = new ExpensesGroupMonthDTO(202206, [mockExpenseEntity]);
    jest.spyOn(expenseRepository, 'query').mockResolvedValue([mock]);

    const data = await getExpenseService.getUnplannedExpenses(
      userId,
      start,
      end,
    );
    expect(data).toBeDefined();
    expect(data).toEqual({
      '202206': mock,
    });
  });

  it('should throw ExpenseNotFoundException when call getUnplannedExpenses', async () => {
    jest.spyOn(expenseRepository, 'query').mockImplementation(undefined);

    await expect(
      getExpenseService.getUnplannedExpenses(userId, start, end),
    ).rejects.toThrowError(ExpenseNotFoundException);
  });
});
