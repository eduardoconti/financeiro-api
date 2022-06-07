import { Test } from '@nestjs/testing';

import { mockEarningEntity, mockEarningRequest } from '@earning/mocks';
import { IEarningRepository } from '@earning/repository';

import { TYPES } from '@config/dependency-injection';

import { InsertEarningService } from './insert-earning.service';
import { IInsertEarningService } from './insert-earning.service.interface';

describe('InsertEarningService', () => {
  let insertEarningService: IInsertEarningService;
  let earningRepository: IEarningRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.EarningRepository,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertEarningService,
          useClass: InsertEarningService,
        },
      ],
    }).compile();

    insertEarningService = module.get<IInsertEarningService>(
      TYPES.InsertEarningService,
    );
    earningRepository = module.get<IEarningRepository>(TYPES.EarningRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(insertEarningService).toBeDefined();
    expect(earningRepository).toBeDefined();
  });

  it('should insert a new earning', async () => {
    jest
      .spyOn(earningRepository, 'insert')
      .mockResolvedValue(mockEarningEntity);
    const data = await insertEarningService.insert(
      mockEarningRequest,
      mockEarningEntity.userId,
    );

    expect(data).toBeDefined();
    expect(data).toEqual(mockEarningEntity);
  });
});
