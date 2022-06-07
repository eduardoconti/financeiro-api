import { Test } from '@nestjs/testing';

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
          },
        },
        {
          provide: TYPES.CarteiraService,
          useClass: GetWalletService,
        },
      ],
    }).compile();

    getWalletService = module.get<GetWalletService>(TYPES.CarteiraService);
    walletRepository = module.get<IWalletRepository>(TYPES.WalletRepository);
  });

  it('should be defined', () => {
    expect(getWalletService).toBeDefined();
    expect(walletRepository).toBeDefined();
  });

  // it('should get all wallets', async () => {
  //   jest.spyOn(walletRepository, 'find').mockResolvedValue(mockWalletEntity);

  //   const data = await getWalletService.getAllByUserId(mockWalletEntity.userId);

  //   expect(data).toBeDefined();
  //   expect(data).toEqual(mockWalletEntity);
  // });
});
