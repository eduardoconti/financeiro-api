import { Test } from '@nestjs/testing';

import { mockWalletEntity, mockWalletRequest } from '@wallet/mocks';
import { IWalletRepository } from '@wallet/repository';

import { TYPES } from '@config/dependency-injection';

import { InsertWalletService } from './insert-wallet.service';
import { IInsertWalletService } from './insert-wallet.service.interface';
import { BadRequestException } from '@config/exceptions';

describe('InsertWalletService', () => {
  let insertWalletService: IInsertWalletService;
  let walletRepository: IWalletRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.WalletRepository,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertWalletService,
          useClass: InsertWalletService,
        },
      ],
    }).compile();

    insertWalletService = module.get<InsertWalletService>(
      TYPES.InsertWalletService,
    );
    walletRepository = module.get<IWalletRepository>(TYPES.WalletRepository);
  });

  it('should be defined', () => {
    expect(insertWalletService).toBeDefined();
    expect(walletRepository).toBeDefined();
  });

  it('should insert a wallet', async () => {
    jest.spyOn(walletRepository, 'insert').mockResolvedValue(mockWalletEntity);

    const data = await insertWalletService.insertWallet(mockWalletRequest);

    expect(data).toBeDefined();
    expect(data).toEqual(mockWalletEntity);
  });

  it('should throw BadRequestException', async () => {
    jest
      .spyOn(walletRepository, 'insert')
      .mockRejectedValue(new BadRequestException());

    await expect(
      insertWalletService.insertWallet(mockWalletRequest),
    ).rejects.toThrow(new BadRequestException());
  });
});
