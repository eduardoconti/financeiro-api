import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { TransferenciasController } from './transferencias.controller';

describe('TransferenciasController', () => {
  let controller: TransferenciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferenciasController],
      imports: [ConfigModule],
      providers: [
        {
          provide: TYPES.GetTransferenceService,
          useValue: {
            getAllTransferencesByUser: jest.fn(),
            findOne: jest.fn(),
            getTransferenceValuesGroupByWallet: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertTransferenceService,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateTransferenceService,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteTransferenceService,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransferenciasController>(TransferenciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
