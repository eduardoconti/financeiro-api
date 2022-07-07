import { Test } from '@nestjs/testing';

import { ForbiddenWalletException } from '@wallet/exception';
import { mockWalletEntity } from '@wallet/mocks';
import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { GetWalletService } from './get-wallet.service';
import { IGetWalletService } from './get-wallet.service.interface';

describe('GetWalletService', () => {
  let getWalletService: IGetWalletService;
  let walletRepository: IWalletRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.WalletRepository,
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: TYPES.GetWalletService,
          useClass: GetWalletService,
        },
      ],
    }).compile();

    getWalletService = module.get<GetWalletService>(TYPES.GetWalletService);
    walletRepository = module.get<IWalletRepository>(TYPES.WalletRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(getWalletService).toBeDefined();
    expect(walletRepository).toBeDefined();
  });

  it('should get all wallets', async () => {
    jest.spyOn(walletRepository, 'find').mockResolvedValue([mockWalletEntity]);

    const data = await getWalletService.getAllByUserId(mockWalletEntity.userId);

    expect(data).toBeDefined();
    expect(data).toEqual([mockWalletEntity]);
  });

  it('should find one', async () => {
    jest
      .spyOn(walletRepository, 'findById')
      .mockResolvedValue(mockWalletEntity);

    const data = await getWalletService.findOne(
      mockWalletEntity.id as number,
      mockWalletEntity.userId,
    );

    expect(data).toBeDefined();
    expect(data).toEqual(mockWalletEntity);
  });

  it('should throw ForbiddenWalletException when not is the same user', async () => {
    jest
      .spyOn(walletRepository, 'findById')
      .mockResolvedValue(mockWalletEntity);

    await expect(
      getWalletService.findOne(mockWalletEntity.id as number, 'anotheUser'),
    ).rejects.toThrow(ForbiddenWalletException);
  });
});
