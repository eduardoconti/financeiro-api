import { Test } from '@nestjs/testing';

import { EarningNotFoundException } from '@earning/exceptions';
import { mockEarningEntity, mockEarningRequest } from '@earning/mocks';
import { IEarningRepository } from '@earning/repository';

import { TYPES } from '@config/dependency-injection';

import { UpdateEarningService } from './update-earning.service';
import { IUpdateEarningService } from './update-earning.service.interface';
jest.mock('@shared/helpers', () => ({
  DateHelper: {
    dateNow: () => new Date('2022-05-26T18:59:18.026Z'),
    addMonth: () => new Date('2022-05-26T18:59:18.026Z'),
  },
}));
describe('UpdateEarningService', () => {
  let updateEarningService: IUpdateEarningService;
  let earningRepository: IEarningRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.EarningRepository,
          useValue: {
            findOneByParams: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateEarningService,
          useClass: UpdateEarningService,
        },
      ],
    }).compile();

    updateEarningService = module.get<IUpdateEarningService>(
      TYPES.UpdateEarningService,
    );
    earningRepository = module.get<IEarningRepository>(TYPES.EarningRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(updateEarningService).toBeDefined();
    expect(earningRepository).toBeDefined();
  });

  it('should update an earning', async () => {
    jest
      .spyOn(earningRepository, 'findOneByParams')
      .mockResolvedValue(mockEarningEntity);
    jest.spyOn(earningRepository, 'update').mockResolvedValue({
      ...mockEarningEntity,
      updatedAt: new Date('2022-05-26T18:59:18.026Z'),
    });

    const data = await updateEarningService.update(
      mockEarningEntity.id as number,
      mockEarningEntity.userId,
      mockEarningRequest,
    );

    expect(data).toBeDefined();
    expect(data).toEqual({
      ...mockEarningEntity,
      updatedAt: new Date('2022-05-26T18:59:18.026Z'),
    });
    expect(data.updatedAt).toBeDefined();
  });

  it('should throw EarningNotFoundException', async () => {
    jest.spyOn(earningRepository, 'findOneByParams').mockResolvedValue(null);

    await expect(
      updateEarningService.update(
        mockEarningEntity.id as number,
        mockEarningEntity.userId,
        mockEarningRequest,
      ),
    ).rejects.toThrowError(EarningNotFoundException);
  });

  it('should update flag payed to true', async () => {
    jest
      .spyOn(earningRepository, 'findOneByParams')
      .mockResolvedValue(mockEarningEntity);
    jest.spyOn(earningRepository, 'update').mockResolvedValue({
      ...mockEarningEntity,
      updatedAt: new Date('2022-05-26T18:59:18.026Z'),
      pagamento: new Date('2022-05-26T18:59:18.026Z'),
    });

    const data = await updateEarningService.updateFlagPayed(
      mockEarningEntity.id as number,
      mockEarningEntity.userId,
      {
        pago: true,
      },
    );

    expect(data).toBeDefined();
    expect(data).toEqual({
      ...mockEarningEntity,
      updatedAt: new Date('2022-05-26T18:59:18.026Z'),
      pagamento: new Date('2022-05-26T18:59:18.026Z'),
    });
    expect(data.updatedAt).toBeDefined();
    expect(data.pagamento).toBeDefined();
  });

  it('should throw EarningNotFoundException when update flag payed', async () => {
    jest.spyOn(earningRepository, 'findOneByParams').mockResolvedValue(null);

    await expect(
      updateEarningService.updateFlagPayed(
        mockEarningEntity.id as number,
        mockEarningEntity.userId,
        {
          pago: true,
        },
      ),
    ).rejects.toThrowError(EarningNotFoundException);
  });

  it('should update return a expense if flag is the same in databse', async () => {
    jest
      .spyOn(earningRepository, 'findOneByParams')
      .mockResolvedValue(mockEarningEntity);

    const data = await updateEarningService.updateFlagPayed(
      mockEarningEntity.id as number,
      mockEarningEntity.userId,
      {
        pago: false,
      },
    );

    expect(data).toBeDefined();
    expect(data).toEqual(mockEarningEntity);
    expect(earningRepository.update).not.toBeCalled();
  });
});
