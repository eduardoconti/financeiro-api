import { Test } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';

import {
  DeleteTransferenceException,
  TransferenceNotFoundException,
} from '@transference/exceptions';
import { transferenceEntityMock } from '@transference/mocks';
import { ITransferenceRepository } from '@transference/repository';

import { DeleteTransferenceService } from './delete-transference.service';
import { IDeleteTransferenceService } from './delete-transference.service.interface';

describe('DeleteTransferenceService', () => {
  let service: IDeleteTransferenceService;
  let transferenceRepository: ITransferenceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.TransferenceRepository,
          useValue: {
            delete: jest.fn(),
            findOneByParams: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteTransferenceService,
          useClass: DeleteTransferenceService,
        },
      ],
    }).compile();

    service = module.get<IDeleteTransferenceService>(
      TYPES.DeleteTransferenceService,
    );
    transferenceRepository = module.get<ITransferenceRepository>(
      TYPES.TransferenceRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(transferenceRepository).toBeDefined();
  });

  it('should call delete', async () => {
    jest
      .spyOn(transferenceRepository, 'findOneByParams')
      .mockResolvedValue(transferenceEntityMock);
    jest
      .spyOn(transferenceRepository, 'delete')
      .mockResolvedValue({ deleted: true });

    const result = await service.delete(1, fakeUserId);

    expect(result).toEqual({ deleted: true });
  });

  it('should throw DeleteTransferenceException when call delete ocurred error in findOneByParams', async () => {
    jest
      .spyOn(transferenceRepository, 'findOneByParams')
      .mockRejectedValue(new Error());

    await expect(service.delete(1, fakeUserId)).rejects.toThrowError(
      DeleteTransferenceException,
    );
  });

  it('should throw TransferenceNotFoundException when findOneByParams is null', async () => {
    jest
      .spyOn(transferenceRepository, 'findOneByParams')
      .mockResolvedValue(null);

    await expect(service.delete(1, fakeUserId)).rejects.toThrowError(
      TransferenceNotFoundException,
    );
  });
});
