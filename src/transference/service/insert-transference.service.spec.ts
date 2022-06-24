import { Test } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import {
  transferenceEntityMock,
  transferenceRequestMock,
} from '@transference/mocks';
import { ITransferenceRepository } from '@transference/repository';

import { InsertTransferenceService } from './insert-transference.service';
import { IInsertTransferenceService } from './insert-transference.service.interface';
import { fakeUserId } from '@expense/mocks';

describe('InsertTransferenceService', () => {
  let insertTransferenceService: IInsertTransferenceService;
  let transferenceRepository: ITransferenceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.TransferenceRepository,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertTransferenceService,
          useClass: InsertTransferenceService,
        },
      ],
    }).compile();

    insertTransferenceService = module.get<IInsertTransferenceService>(
      TYPES.InsertTransferenceService,
    );
    transferenceRepository = module.get<ITransferenceRepository>(
      TYPES.TransferenceRepository,
    );
  });

  it('should be defined', () => {
    expect(insertTransferenceService).toBeDefined();
    expect(transferenceRepository).toBeDefined();
  });

  it('should call insert', async () => {
    jest
      .spyOn(transferenceRepository, 'insert')
      .mockResolvedValue(transferenceEntityMock);

    const result = await insertTransferenceService.insert(
      transferenceRequestMock,
      fakeUserId,
    );

    expect(result).toEqual(transferenceEntityMock);
  });
});
