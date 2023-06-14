import { Test } from '@nestjs/testing';

import { mockWalletEntity, mockWalletUpdateInput } from '@wallet/mocks';
import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { UpdateWalletService } from './update-wallet.service';
import { IUpdateWalletService } from './update-wallet.service.interface';

describe('UpdateWalletService', () => {
  let updateWalletService: IUpdateWalletService;
  let walletRepository: IWalletRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.WalletRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateWalletService,
          useClass: UpdateWalletService,
        },
      ],
    }).compile();

    updateWalletService = module.get<UpdateWalletService>(
      TYPES.UpdateWalletService,
    );
    walletRepository = module.get<IWalletRepository>(TYPES.WalletRepository);
  });

  it('should be defined', () => {
    expect(updateWalletService).toBeDefined();
    expect(walletRepository).toBeDefined();
  });

  it('should update a wallet', async () => {
    jest.spyOn(walletRepository, 'update').mockResolvedValue(mockWalletEntity);
    jest
      .spyOn(walletRepository, 'findById')
      .mockResolvedValue(mockWalletEntity);

    const data = await updateWalletService.updateWallet(mockWalletUpdateInput);

    expect(data).toBeDefined();
    expect(data).toEqual(mockWalletEntity);
  });
});
