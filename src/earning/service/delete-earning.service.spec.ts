import { Test } from '@nestjs/testing';

import {
  DeleteEarningException,
  EarningNotFoundException,
} from '@earning/exceptions';
import { mockEarningEntity } from '@earning/mocks';
import { IEarningRepository } from '@earning/repository';

import { TYPES } from '@config/dependency-injection';

import { DeleteEarningService } from './delete-earning.service';
import { IDeleteEarningService } from './delete-earning.service.interface';

describe('DeleteEarningService', () => {
  let service: IDeleteEarningService;
  let earningRepository: IEarningRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.EarningRepository,
          useValue: {
            findOneByParams: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteEarningService,
          useClass: DeleteEarningService,
        },
      ],
    }).compile();

    service = module.get<IDeleteEarningService>(TYPES.DeleteEarningService);
    earningRepository = module.get<IEarningRepository>(TYPES.EarningRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(earningRepository).toBeDefined();
  });

  it('should be able to delete', async () => {
    jest
      .spyOn(earningRepository, 'findOneByParams')
      .mockResolvedValue(mockEarningEntity);
    jest
      .spyOn(earningRepository, 'delete')
      .mockResolvedValue({ deleted: true });

    await expect(
      service.delete(mockEarningEntity.id as number, mockEarningEntity.userId),
    ).resolves.toBeDefined();
    expect(earningRepository.findOneByParams).toHaveBeenCalledWith({
      id: mockEarningEntity.id,
      userId: mockEarningEntity.userId,
    });
    expect(earningRepository.delete).toHaveBeenCalledWith(mockEarningEntity.id);
  });

  it('should throw DeleteEarningException when error to findOneByParams', async () => {
    jest
      .spyOn(earningRepository, 'findOneByParams')
      .mockRejectedValue(new Error());
    await expect(
      service.delete(mockEarningEntity.id as number, mockEarningEntity.userId),
    ).rejects.toThrowError(DeleteEarningException);
  });

  it('should throw EarningNotFoundException when earning not found', async () => {
    jest.spyOn(earningRepository, 'findOneByParams').mockResolvedValue(null);
    await expect(
      service.delete(mockEarningEntity.id as number, mockEarningEntity.userId),
    ).rejects.toThrowError(EarningNotFoundException);
  });
});
