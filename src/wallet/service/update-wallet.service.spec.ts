import { Test } from '@nestjs/testing';

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
            findOneByParams: jest.fn(),
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

  // it('should update a wallet', async () => {
  //   jest
  //     .spyOn(walletRepository, 'findOneByParams')
  //     .mockResolvedValue(mockWalletEntity);
  //   jest
  //     .spyOn(walletRepository, 'update')
  //     .mockResolvedValue(mockWalletEntity);

  //   const data = await updateWalletService.update(
  //     mockWalletEntity.id as number,
  //     mockWalletEntity.userId,
  //     fakeInsertWalletRequest,
  //   );

  //   expect(data).toBeDefined();
  //   expect(data).toEqual(mockWalletEntity);
  // });

  // it('should throw WalletNotFoundException', async () => {
  //   jest.spyOn(walletRepository, 'findOneByParams').mockResolvedValue(null);

  //   await expect(
  //     updateWalletService.update(
  //       mockWalletEntity.id as number,
  //       mockWalletEntity.userId,
  //       fakeInsertWalletRequest,
  //   )).rejects.toThrowError(BadRequestException);
  // });
});
