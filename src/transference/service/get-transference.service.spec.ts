import { Test } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';

import { TransferenceNotFoundException } from '@transference/exceptions';
import { transferenceEntityMock } from '@transference/mocks';
import { ITransferenceRepository } from '@transference/repository';

import { GetTransferenceService } from './get-transference.service';
import { IGetTransferenceService } from './get-transference.service.interface';

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
