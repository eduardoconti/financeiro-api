import { Test } from '@nestjs/testing';

import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { DeleteWalletService } from './delete-wallet.service';
import { IDeleteWalletService } from './delete-wallet.service.interface';

describe('DeleteWalletService', () => {
  let deleteWalletService: IDeleteWalletService;
  let walletRepository: IWalletRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.WalletRepository,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteWalletService,
          useClass: DeleteWalletService,
        },
      ],
    }).compile();

    deleteWalletService = module.get<DeleteWalletService>(
      TYPES.DeleteWalletService,
    );
    walletRepository = module.get<IWalletRepository>(TYPES.WalletRepository);
  });

  it('should be defined', () => {
    expect(deleteWalletService).toBeDefined();
    expect(walletRepository).toBeDefined();
  });

  // it('should delete a wallet', async () => {
  //   jest
  //     .spyOn(walletRepository, 'delete')
  //     .mockResolvedValue(mockWalletEntity);

  //   const data = await deleteWalletService.delete(
  //     mockWalletEntity.id as number,
  //   );

  //   expect(data).toBeDefined();
  //   expect(data).toEqual(mockWalletEntity);
  // });

  // it('should throw WalletNotFoundException', async () => {
  //   jest.spyOn(walletRepository, 'delete').mockResolvedValue(null);

  //   await expect(
  //     deleteWalletService.delete(mockWalletEntity.id as number),
  //   ).rejects.toThrowError(WalletNotFoundException);
  // });
});
