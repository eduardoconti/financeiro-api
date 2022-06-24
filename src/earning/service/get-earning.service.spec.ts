import { Test } from '@nestjs/testing';

import { EarningNotFoundException } from '@earning/exceptions';
import {
  getEarningsGroupByMonthResponseMock,
  getEarningsGroupByMonthSqlMock,
  getEarningValuesGroupByWalletSqlMock,
  getTotalEarningsSqlMock,
  mockEarningEntity,
} from '@earning/mocks';
import { IEarningRepository } from '@earning/repository';

import { TYPES } from '@config/dependency-injection';

import { GetEarningService } from './get-earning.service';
import { IGetEarningService } from './get-earning.service.interface';

describe('GetEarningService', () => {
  let getEarningService: IGetEarningService;
  let earningRepository: IEarningRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.EarningRepository,
          useValue: {
            findByParams: jest.fn(),
            query: jest.fn(),
            findOneByParams: jest.fn(),
          },
        },
        {
          provide: TYPES.GetEarningService,
          useClass: GetEarningService,
        },
      ],
    }).compile();

    getEarningService = module.get<IGetEarningService>(TYPES.GetEarningService);
    earningRepository = module.get<IEarningRepository>(TYPES.EarningRepository);
  });

  it('should be defined', () => {
    expect(getEarningService).toBeDefined();
    expect(earningRepository).toBeDefined();
  });

  it('should getAllEarningsByUser', async () => {
    jest
      .spyOn(earningRepository, 'findByParams')
      .mockResolvedValue([mockEarningEntity]);

    const result = await getEarningService.getAllEarningsByUser(
      mockEarningEntity.userId,
      '2022-05-26T18:59:18.026Z',
      '2022-05-26T18:59:18.026Z',
      true,
    );
    await expect(result).toEqual([mockEarningEntity]);
  });

  it('should getAllEarningsByUser without end param', async () => {
    jest
      .spyOn(earningRepository, 'findByParams')
      .mockResolvedValue([mockEarningEntity]);

    const result = await getEarningService.getAllEarningsByUser(
      mockEarningEntity.userId,
      '2022-05-26T18:59:18.026Z',
    );
    await expect(result).toEqual([mockEarningEntity]);
  });

  it('should getAllEarningsByUser without start param', async () => {
    jest
      .spyOn(earningRepository, 'findByParams')
      .mockResolvedValue([mockEarningEntity]);

    const result = await getEarningService.getAllEarningsByUser(
      mockEarningEntity.userId,
      undefined,
      '2022-05-26T18:59:18.026Z',
    );
    await expect(result).toEqual([mockEarningEntity]);
  });

  it('should getEarningsGroupByMonth', async () => {
    jest
      .spyOn(earningRepository, 'query')
      .mockResolvedValue(getEarningsGroupByMonthSqlMock);

    const result = await getEarningService.getEarningsGroupByMonth(
      mockEarningEntity.userId,
      '2022-05-26T18:59:18.026Z',
      '2022-05-26T18:59:18.026Z',
    );
    await expect(result).toEqual(getEarningsGroupByMonthResponseMock);
  });

  it('should getEarningValuesGroupByWallet', async () => {
    jest
      .spyOn(earningRepository, 'query')
      .mockResolvedValue(getEarningValuesGroupByWalletSqlMock);

    const result = await getEarningService.getEarningValuesGroupByWallet(
      mockEarningEntity.userId,
      '2022-05-26T18:59:18.026Z',
      '2022-05-26T18:59:18.026Z',
    );
    await expect(result).toEqual(getEarningValuesGroupByWalletSqlMock);
  });

  it('should getTotalEarnings', async () => {
    jest
      .spyOn(earningRepository, 'query')
      .mockResolvedValue(getTotalEarningsSqlMock);

    const result = await getEarningService.getTotalEarnings(
      mockEarningEntity.userId,
      '2022-05-26T18:59:18.026Z',
      '2022-05-26T18:59:18.026Z',
    );
    await expect(result).toEqual(getTotalEarningsSqlMock[0]);
  });

  it('should findOne', async () => {
    jest
      .spyOn(earningRepository, 'findOneByParams')
      .mockResolvedValue(mockEarningEntity);

    const result = await getEarningService.findOne({
      userId: mockEarningEntity.userId,
    });
    await expect(result).toEqual(mockEarningEntity);
  });

  it('should throw EarningNotFoundException when call findOneByParams', async () => {
    jest.spyOn(earningRepository, 'findOneByParams').mockResolvedValue(null);

    await expect(
      getEarningService.findOne({
        userId: mockEarningEntity.userId,
      }),
    ).rejects.toThrowError(EarningNotFoundException);
  });
});
