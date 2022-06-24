import { Test } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';

import { TransferenceNotFoundException } from '@transference/exceptions';
import {
  transferenceEntityMock,
  transferenceRequestMock,
} from '@transference/mocks';
import { ITransferenceRepository } from '@transference/repository';

import { UpdateTransferenceService } from './update-transference.service';
import { IUpdateTransferenceService } from './update-transference.service.interface';

describe('UpdateTransferenceService', () => {
  let updateTransferenceService: IUpdateTransferenceService;
  let transferenceRepository: ITransferenceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.TransferenceRepository,
          useValue: {
            update: jest.fn(),
            findOneByParams: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateTransferenceService,
          useClass: UpdateTransferenceService,
        },
      ],
    }).compile();

    updateTransferenceService = module.get<IUpdateTransferenceService>(
      TYPES.UpdateTransferenceService,
    );
    transferenceRepository = module.get<ITransferenceRepository>(
      TYPES.TransferenceRepository,
    );
  });

  it('should be defined', () => {
    expect(updateTransferenceService).toBeDefined();
    expect(transferenceRepository).toBeDefined();
  });

  it('should call update', async () => {
    jest
      .spyOn(transferenceRepository, 'findOneByParams')
      .mockResolvedValue(transferenceEntityMock);

    jest
      .spyOn(transferenceRepository, 'update')
      .mockResolvedValue(transferenceEntityMock);

    const result = await updateTransferenceService.update(
      1,
      fakeUserId,
      transferenceRequestMock,
    );

    expect(result).toEqual(transferenceEntityMock);
  });

  it('should throw TransferenceNotFoundException when call update', async () => {
    jest
      .spyOn(transferenceRepository, 'findOneByParams')
      .mockResolvedValue(null);

    await expect(
      updateTransferenceService.update(1, fakeUserId, transferenceRequestMock),
    ).rejects.toThrowError(TransferenceNotFoundException);

    expect(transferenceRepository.update).not.toBeCalled();
  });

  it('should call updateFlagPayed and alter flag payed', async () => {
    jest
      .spyOn(transferenceRepository, 'findOneByParams')
      .mockResolvedValue(transferenceEntityMock);

    jest
      .spyOn(transferenceRepository, 'update')
      .mockResolvedValue({ ...transferenceEntityMock, pago: true });

    const result = await updateTransferenceService.updateFlagPayed(
      1,
      fakeUserId,
      { pago: true },
    );

    expect(result).toEqual({ ...transferenceEntityMock, pago: true });
  });

  it('should call updateFlagPayed with de same flag', async () => {
    jest
      .spyOn(transferenceRepository, 'findOneByParams')
      .mockResolvedValue(transferenceEntityMock);

    jest
      .spyOn(transferenceRepository, 'update')
      .mockResolvedValue(transferenceEntityMock);

    const result = await updateTransferenceService.updateFlagPayed(
      1,
      fakeUserId,
      { pago: false },
    );

    expect(result).toEqual(transferenceEntityMock);
  });

  it('should throw TransferenceNotFoundException when call updateFlagPayed', async () => {
    jest
      .spyOn(transferenceRepository, 'findOneByParams')
      .mockResolvedValue(null);

    await expect(
      updateTransferenceService.updateFlagPayed(1, fakeUserId, { pago: true }),
    ).rejects.toThrowError(TransferenceNotFoundException);

    expect(transferenceRepository.update).not.toBeCalled();
  });
});
