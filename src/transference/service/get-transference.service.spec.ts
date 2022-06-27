import { Test } from '@nestjs/testing';
import { Between } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';

import { TransferenceNotFoundException } from '@transference/exceptions';
import {
  getTotalTransferencesSqlMock,
  getTransferencesGroupByMonthResponseMock,
  getTransferencesGroupByMonthSqlMock,
  getTransferenceValuesGroupByWalletMock,
  transferenceEntityMock,
} from '@transference/mocks';
import { ITransferenceRepository } from '@transference/repository';

import { DateHelper } from '@shared/helpers';

import { GetTransferenceService } from './get-transference.service';
import { IGetTransferenceService } from './get-transference.service.interface';

jest.mock('@shared/helpers', () => ({
  SqlFileManager: {
    readFile: () => 'fake sql',
  },
  DateHelper: {
    dateNow: () => new Date('2022-05-26T18:59:18.026Z'),
    addMonth: () => new Date('2022-05-26T18:59:18.026Z'),
    date: () => new Date('2022-05-26T18:59:18.026Z'),
  },
  OrmHelper: {
    buildDateWhere: () =>
      Between(DateHelper.date('2022-24-06'), DateHelper.date('2022-24-06')),
  },
}));
describe('GetTransferenceService', () => {
  let service: IGetTransferenceService;
  let transferenceRepository: ITransferenceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.TransferenceRepository,
          useValue: {
            findByParams: jest.fn(),
            findOneByParams: jest.fn(),
            query: jest.fn(),
          },
        },
        {
          provide: TYPES.GetTransferenceService,
          useClass: GetTransferenceService,
        },
      ],
    }).compile();

    service = module.get<IGetTransferenceService>(TYPES.GetTransferenceService);
    transferenceRepository = module.get<ITransferenceRepository>(
      TYPES.TransferenceRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(transferenceRepository).toBeDefined();
  });

  it('should call getAllTransferencesByUser', async () => {
    jest
      .spyOn(transferenceRepository, 'findByParams')
      .mockResolvedValue([transferenceEntityMock]);

    const result = await service.getAllTransferencesByUser(
      fakeUserId,
      '2022-06-24',
      '2022-06-24',
      false,
    );

    expect(result).toEqual([transferenceEntityMock]);
  });

  it('should call getAllTransferencesByUser without start param', async () => {
    jest
      .spyOn(transferenceRepository, 'findByParams')
      .mockResolvedValue([transferenceEntityMock]);

    const result = await service.getAllTransferencesByUser(
      fakeUserId,
      undefined,
      '2022-06-24',
      true,
    );

    expect(result).toEqual([transferenceEntityMock]);
  });

  it('should call getTransferencesGroupByMonth', async () => {
    jest
      .spyOn(transferenceRepository, 'query')
      .mockResolvedValue(getTransferencesGroupByMonthSqlMock);

    const result = await service.getTransferencesGroupByMonth(
      fakeUserId,
      undefined,
      '2022-06-24',
    );

    expect(result).toEqual(getTransferencesGroupByMonthResponseMock);
  });

  it('should call getTransferenceValuesGroupByWallet', async () => {
    jest
      .spyOn(transferenceRepository, 'query')
      .mockResolvedValue(getTransferenceValuesGroupByWalletMock);

    const result = await service.getTransferenceValuesGroupByWallet(fakeUserId);

    expect(result).toEqual(getTransferenceValuesGroupByWalletMock);
  });

  it('should call getTransferenceValuesGroupByWallet destiny', async () => {
    jest
      .spyOn(transferenceRepository, 'query')
      .mockResolvedValue(getTransferenceValuesGroupByWalletMock);

    const result = await service.getTransferenceValuesGroupByWallet(
      fakeUserId,
      'destiny',
      undefined,
      '2022-06-24',
    );

    expect(result).toEqual(getTransferenceValuesGroupByWalletMock);
  });

  it('should call getTotalTransferences', async () => {
    jest
      .spyOn(transferenceRepository, 'query')
      .mockResolvedValue(getTotalTransferencesSqlMock);

    const result = await service.getTotalTransferences(
      fakeUserId,
      '2022-06-24',
    );

    expect(result).toEqual(getTotalTransferencesSqlMock[0]);
    expect(transferenceRepository.query).toHaveBeenCalledWith('fake sql', [
      fakeUserId,
      '2022-06-24',
      undefined,
    ]);
  });
  it('should call findOne', async () => {
    jest
      .spyOn(transferenceRepository, 'findOneByParams')
      .mockResolvedValue(transferenceEntityMock);

    const result = await service.findOne({
      id: 1,
      userId: fakeUserId,
    });

    expect(result).toEqual(transferenceEntityMock);
  });

  it('should throw TransferenceNotFoundException when call findOne', async () => {
    jest
      .spyOn(transferenceRepository, 'findOneByParams')
      .mockResolvedValue(null);

    await expect(
      service.findOne({
        id: 1,
        userId: fakeUserId,
      }),
    ).rejects.toThrowError(TransferenceNotFoundException);
  });
});
