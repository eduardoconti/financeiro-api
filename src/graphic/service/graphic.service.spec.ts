import { Test, TestingModule } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { GraphicService } from './graphic.service';

describe('GraphicService', () => {
  let service: GraphicService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
