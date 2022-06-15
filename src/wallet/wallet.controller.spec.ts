import { Test } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import {
  IDeleteWalletService,
  IGetWalletService,
  IInsertWalletService,
  IUpdateWalletService,
} from './service';

describe('WalletController', () => {
  let getWalletService: IGetWalletService;
  let insertWalletService: IInsertWalletService;
  let updateWalletService: IUpdateWalletService;
  let deleteWalletService: IDeleteWalletService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.CarteiraService,
          useValue: {
            getAllByUserId: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertWalletService,
          useValue: {
            insertWallet: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateWalletService,
          useValue: {
            updateWallet: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteWalletService,
          useValue: {
            deleteWallet: jest.fn(),
          },
        },
      ],
    }).compile();

    getWalletService = module.get<IGetWalletService>(TYPES.CarteiraService);
    insertWalletService = module.get<IInsertWalletService>(
      TYPES.InsertWalletService,
    );
    updateWalletService = module.get<IUpdateWalletService>(
      TYPES.UpdateWalletService,
    );
    deleteWalletService = module.get<IDeleteWalletService>(
      TYPES.DeleteWalletService,
    );
  });

  it('should be defined', () => {
    expect(getWalletService).toBeDefined();
    expect(insertWalletService).toBeDefined();
    expect(updateWalletService).toBeDefined();
    expect(deleteWalletService).toBeDefined();
  });
});
