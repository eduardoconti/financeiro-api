import { Test, TestingModule } from '@nestjs/testing';

import { EarningsGroupMonthDTO } from '@earning/dto';
import {
  getEarningsGroupByMonthResponseMock,
  getEarningsGroupByMonthSqlMock,
} from '@earning/mocks';
import { IGetEarningService } from '@earning/service';

import { TYPES } from '@config/dependency-injection';

import {
  fakeUserId,
  getExpensesGroupByMonthResponseMock,
} from '@expense/mocks';
import { IGetExpenseService } from '@expense/service';

import { GraphicService } from './graphic.service';
import { IGraphicService } from './graphic.service.interface';

describe('GraphicService', () => {
  let service: IGraphicService;
  let getEarningService: IGetEarningService;
  let getExpenseService: IGetExpenseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.GetEarningService,
          useValue: {
            getEarningsGroupByMonth: jest.fn(),
          },
        },
        {
          provide: TYPES.GetExpenseService,
          useValue: {
            getExpensesGroupByMonth: jest.fn(),
          },
        },
        {
          provide: TYPES.GraphicService,
          useClass: GraphicService,
        },
      ],
    }).compile();

    service = module.get<GraphicService>(TYPES.GraphicService);
    getEarningService = module.get<IGetEarningService>(TYPES.GetEarningService);
    getExpenseService = module.get<IGetExpenseService>(TYPES.GetExpenseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(getEarningService).toBeDefined();
    expect(getExpenseService).toBeDefined();
  });

  it('should call generalGraphic  when earning more than months data', async () => {
    jest
      .spyOn(getEarningService, 'getEarningsGroupByMonth')
      .mockResolvedValue(getEarningsGroupByMonthResponseMock);
    jest
      .spyOn(getExpenseService, 'getExpensesGroupByMonth')
      .mockResolvedValue(getExpensesGroupByMonthResponseMock);
    const result = await service.generalGraphic(fakeUserId);
    expect(result).toBeDefined();
    expect(result.months).toHaveLength(
      Object.getOwnPropertyNames(getEarningsGroupByMonthResponseMock).length,
    );
  });

  it('should call generalGraphic when expense more than months data', async () => {
    jest.spyOn(getEarningService, 'getEarningsGroupByMonth').mockResolvedValue({
      '202201': EarningsGroupMonthDTO.build({
        ...getEarningsGroupByMonthSqlMock[0].data,
      }),
    });
    jest
      .spyOn(getExpenseService, 'getExpensesGroupByMonth')
      .mockResolvedValue(getExpensesGroupByMonthResponseMock);
    const result = await service.generalGraphic(fakeUserId);
    expect(result).toBeDefined();
    expect(result.months).toHaveLength(
      Object.getOwnPropertyNames(getExpensesGroupByMonthResponseMock).length,
    );
  });
});
