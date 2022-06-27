import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { userPayloadInterfaceMock } from '@auth/mocks';

import { TYPES } from '@config/dependency-injection';

import { ExpenseDeleteResponseDTO } from './dto';
import { ExpenseController } from './expense.controller';
import {
  fakeInsertExpenseRequest,
  findExpenseByQueryParamsDTOMock,
  getExpenseAmountGroupByCategoryResponseMock,
  getExpenseAmountGroupByWalletResponseMock,
  getExpensesGroupByMonthResponseMock,
  getTotalExpensesResponseMock,
  mockExpenseEntity,
} from './mocks';
import {
  IDeleteExpenseService,
  IGetExpenseService,
  IInsertExpenseService,
  IUpdateExpenseService,
} from './service';

describe('ExpenseController', () => {
  let expenseController: ExpenseController;
  let updateExpenseService: IUpdateExpenseService;
  let getExpenseService: IGetExpenseService;
  let insertExpenseService: IInsertExpenseService;
  let deleteExpenseService: IDeleteExpenseService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [
        {
          provide: TYPES.UpdateExpenseService,
          useValue: {
            update: jest.fn(),
            updateFlagPayed: jest.fn(),
          },
        },
        {
          provide: TYPES.GetExpenseService,
          useValue: {
            getAllExpensesByUser: jest.fn(),
            getTotalExpenses: jest.fn(),
            getExpensesGroupByMonth: jest.fn(),
            getExpenseValuesGroupByCategory: jest.fn(),
            getExpenseValuesGroupByWallet: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertExpenseService,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteExpenseService,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    expenseController = module.get(ExpenseController);
    updateExpenseService = module.get<IUpdateExpenseService>(
      TYPES.UpdateExpenseService,
    );
    getExpenseService = module.get<IGetExpenseService>(TYPES.GetExpenseService);
    insertExpenseService = module.get<IInsertExpenseService>(
      TYPES.InsertExpenseService,
    );
    deleteExpenseService = module.get<IDeleteExpenseService>(
      TYPES.DeleteExpenseService,
    );
  });

  it('should be defined', () => {
    expect(expenseController).toBeDefined();
    expect(updateExpenseService).toBeDefined();
    expect(getExpenseService).toBeDefined();
    expect(insertExpenseService).toBeDefined();
    expect(deleteExpenseService).toBeDefined();
  });

  it('should return all expenses', async () => {
    const mockExpenses = [mockExpenseEntity];
    jest
      .spyOn(getExpenseService, 'getAllExpensesByUser')
      .mockResolvedValue(mockExpenses);
    const result = await expenseController.getAllExpenses(
      userPayloadInterfaceMock,
      findExpenseByQueryParamsDTOMock,
    );
    expect(result.data).toEqual(mockExpenses);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should return total expenses', async () => {
    jest
      .spyOn(getExpenseService, 'getTotalExpenses')
      .mockResolvedValue(getTotalExpensesResponseMock);
    const result = await expenseController.getExpensesValues(
      userPayloadInterfaceMock,
      findExpenseByQueryParamsDTOMock,
    );
    expect(result.data).toEqual(getTotalExpensesResponseMock);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should insert expense', async () => {
    jest
      .spyOn(insertExpenseService, 'insert')
      .mockResolvedValue(mockExpenseEntity);
    const result = await expenseController.insertExpense(
      fakeInsertExpenseRequest,
      userPayloadInterfaceMock,
    );
    expect(result.data).toEqual(mockExpenseEntity);
    expect(result.getStatus()).toEqual(HttpStatus.CREATED);
  });

  it('should update expense', async () => {
    jest
      .spyOn(updateExpenseService, 'update')
      .mockResolvedValue(mockExpenseEntity);
    const result = await expenseController.update(
      userPayloadInterfaceMock,
      1,
      fakeInsertExpenseRequest,
    );
    expect(result.data).toEqual(mockExpenseEntity);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should delete expense', async () => {
    const deleted = new ExpenseDeleteResponseDTO();
    jest.spyOn(deleteExpenseService, 'delete').mockResolvedValue(deleted);
    const result = await expenseController.delete(userPayloadInterfaceMock, 1);
    expect(result.data).toEqual(deleted);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should update flag payed', async () => {
    jest
      .spyOn(updateExpenseService, 'updateFlagPayed')
      .mockResolvedValue(mockExpenseEntity);
    const result = await expenseController.updateFlagPayed(
      userPayloadInterfaceMock,
      1,
      { pago: true },
    );
    expect(result.data).toEqual(mockExpenseEntity);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should get expense by id', async () => {
    jest
      .spyOn(getExpenseService, 'findOne')
      .mockResolvedValue(mockExpenseEntity);
    const result = await expenseController.getExpenseById(
      userPayloadInterfaceMock,
      1,
    );
    expect(result.data).toEqual(mockExpenseEntity);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should get expenses values grouped by month', async () => {
    jest
      .spyOn(getExpenseService, 'getExpensesGroupByMonth')
      .mockResolvedValue(getExpensesGroupByMonthResponseMock);
    const result = await expenseController.getExpensesValuesGroupByMonth(
      userPayloadInterfaceMock,
      findExpenseByQueryParamsDTOMock,
    );
    expect(result.data).toEqual(getExpensesGroupByMonthResponseMock);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should get expense values gruped by wallet', async () => {
    jest
      .spyOn(getExpenseService, 'getExpenseValuesGroupByWallet')
      .mockResolvedValue(getExpenseAmountGroupByWalletResponseMock);
    const result = await expenseController.getExpensesValuesGroupByWallet(
      userPayloadInterfaceMock,
      findExpenseByQueryParamsDTOMock,
    );
    expect(result.data).toEqual(getExpenseAmountGroupByWalletResponseMock);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should get expense values gruped by category', async () => {
    jest
      .spyOn(getExpenseService, 'getExpenseValuesGroupByCategory')
      .mockResolvedValue(getExpenseAmountGroupByCategoryResponseMock);
    const result = await expenseController.getExpensesValuesGroupByCategory(
      userPayloadInterfaceMock,
      findExpenseByQueryParamsDTOMock,
    );
    expect(result.data).toEqual(getExpenseAmountGroupByCategoryResponseMock);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });
});
