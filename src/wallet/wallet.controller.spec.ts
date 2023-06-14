import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { userPayloadInterfaceMock } from '@auth/mocks';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';

import {
  mockUpdateWalletRequest,
  mockWalletEntity,
  mockWalletRequest,
} from './mocks';
import {
  IDeleteWalletService,
  IGetWalletService,
  IInsertWalletService,
  IUpdateWalletService,
} from './service';
import { WalletController } from './wallet.controller';

describe('WalletController', () => {
  let getWalletService: IGetWalletService;
  let insertWalletService: IInsertWalletService;
  let updateWalletService: IUpdateWalletService;
  let deleteWalletService: IDeleteWalletService;
  let walletController: WalletController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: TYPES.GetWalletService,
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

    getWalletService = module.get<IGetWalletService>(TYPES.GetWalletService);
    insertWalletService = module.get<IInsertWalletService>(
      TYPES.InsertWalletService,
    );
    updateWalletService = module.get<IUpdateWalletService>(
      TYPES.UpdateWalletService,
    );
    deleteWalletService = module.get<IDeleteWalletService>(
      TYPES.DeleteWalletService,
    );
    walletController = module.get(WalletController);
  });

  it('should be defined', () => {
    expect(getWalletService).toBeDefined();
    expect(insertWalletService).toBeDefined();
    expect(updateWalletService).toBeDefined();
    expect(deleteWalletService).toBeDefined();
    expect(walletController).toBeDefined();
  });

  it('should call getAll', async () => {
    jest
      .spyOn(getWalletService, 'getAllByUserId')
      .mockResolvedValue([mockWalletEntity]);

    const result = await walletController.getAll(userPayloadInterfaceMock);
    expect(result.data).toEqual([mockWalletEntity]);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should call insert', async () => {
    jest
      .spyOn(insertWalletService, 'insertWallet')
      .mockResolvedValue(mockWalletEntity);

    const result = await walletController.insert(
      mockWalletRequest,
      userPayloadInterfaceMock,
    );
    expect(result.data).toEqual(mockWalletEntity);
    expect(result.getStatus()).toEqual(HttpStatus.CREATED);
  });

  it('should call delete', async () => {
    jest
      .spyOn(deleteWalletService, 'deleteWallet')
      .mockResolvedValue({ deleted: true });

    const result = await walletController.delete(
      mockWalletEntity.id as number,
      userPayloadInterfaceMock,
    );
    expect(deleteWalletService.deleteWallet).toHaveBeenCalledWith(
      mockWalletEntity.id as number,
      fakeUserId,
    );
    expect(result.data).toEqual({ deleted: true });
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should call update', async () => {
    jest
      .spyOn(updateWalletService, 'updateWallet')
      .mockResolvedValue(mockWalletEntity);

    const result = await walletController.update(
      mockWalletEntity.id as number,
      userPayloadInterfaceMock,
      mockUpdateWalletRequest,
    );
    expect(result.data).toEqual({
      id: 9999,
      descricao: 'Carteira Teste',
      active: true,
    });
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });
});
