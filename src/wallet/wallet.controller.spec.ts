import { Test } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { GetWalletService, IGetWalletService } from './service';

describe('WalletController', () => {
  let getWalletService: IGetWalletService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.CarteiraService,
          useClass: GetWalletService,
        },
      ],
    }).compile();

    getWalletService = module.get<GetWalletService>(TYPES.CarteiraService);
  });

  it('should be defined', () => {
    expect(getWalletService).toBeDefined();
  });
});
