import { Test } from '@nestjs/testing';

import { mockWalletDeleteResponse, mockWalletEntity } from '@wallet/mocks';
import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';
import { BadRequestException } from '@config/exceptions';

import { DeleteWalletService } from './delete-wallet.service';
import { IDeleteWalletService } from './delete-wallet.service.interface';
import { fakeUserId } from '@expense/mocks';

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

  it('should delete a wallet', async () => {
    jest
      .spyOn(walletRepository, 'delete')
      .mockResolvedValue(mockWalletDeleteResponse);

    const data = await deleteWalletService.deleteWallet(
      mockWalletEntity.id as number,
      fakeUserId,
    );

    expect(data).toBeDefined();
    expect(data).toEqual(mockWalletDeleteResponse);
  });
});
