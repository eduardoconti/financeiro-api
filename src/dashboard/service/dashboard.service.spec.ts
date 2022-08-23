import { Test } from '@nestjs/testing';

import { IGetEarningService } from '@earning/service';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';
import { IGetExpenseService } from '@expense/service';

import { IGetTransferenceService } from '@transference/service';

import { DashBoardService } from './dashboard.service';
import { IDashBoardService } from './dashboard.service.interface';

describe('DashBoardService', () => {
  let expenseService: IGetExpenseService;
  let earningService: IGetEarningService;
  let transferenceService: IGetTransferenceService;
  let dashBoardService: IDashBoardService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.GetExpenseService,
          useValue: {
            getTotalExpenses: jest.fn(),
          },
        },
        {
          provide: TYPES.GetEarningService,
          useValue: {
            getTotalEarnings: jest.fn(),
          },
        },
        {
          provide: TYPES.GetTransferenceService,
          useValue: {
            getTotalTransferences: jest.fn(),
          },
        },
        {
          provide: TYPES.DashBoardService,
          useClass: DashBoardService,
        },
      ],
    }).compile();

    expenseService = moduleRef.get<IGetExpenseService>(TYPES.GetExpenseService);
    earningService = moduleRef.get<IGetEarningService>(TYPES.GetEarningService);
    transferenceService = moduleRef.get<IGetTransferenceService>(
      TYPES.GetTransferenceService,
    );
    dashBoardService = moduleRef.get<IDashBoardService>(TYPES.DashBoardService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(expenseService).toBeDefined();
    expect(earningService).toBeDefined();
    expect(transferenceService).toBeDefined();
    expect(dashBoardService).toBeDefined();
  });

  it('should return dashboard values', async () => {
    jest.spyOn(expenseService, 'getTotalExpenses').mockResolvedValue({
      total: 5000,
      totalOpen: 3000,
      totalPayed: 2000,
    });
    jest.spyOn(earningService, 'getTotalEarnings').mockResolvedValue({
      total: 6000,
      totalOpen: 0,
      totalPayed: 6000,
    });
    const result = await dashBoardService.getValues(fakeUserId, {
      start: '2022-01-01',
      end: '2022-01-28',
    });

    expect(result).toBeDefined();
    expect(expenseService.getTotalExpenses).toBeCalledTimes(2);
    expect(earningService.getTotalEarnings).toBeCalledTimes(2);
    expect(result).toEqual({
      earningsOpen: 0,
      earningsPayed: 6000,
      expensesOpen: 3000,
      expensesPayed: 2000,
      ballance: 1000,
      amount: 4000,
    });
  });
});
