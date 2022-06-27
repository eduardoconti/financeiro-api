import { HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { userPayloadInterfaceMock } from '@auth/mocks';

import { TYPES } from '@config/dependency-injection';

import {
  TransferenceDeleteResponseDTO,
  TransferencePatchFlagPayedDTO,
} from './dto';
import {
  findTransferenceByQueryParamsDTOMock,
  getTransferenceValuesGroupByWalletMock,
  transferenceEntityMock,
  transferenceRequestMock,
} from './mocks';
import {
  IDeleteTransferenceService,
  IGetTransferenceService,
  IInsertTransferenceService,
  IUpdateTransferenceService,
} from './service';
import { TransferenceController } from './transference.controller';

describe('TransferenciasController', () => {
  let controller: TransferenceController;
  let getTransferenceService: IGetTransferenceService;
  let insertTransferenceService: IInsertTransferenceService;
  let updateTransferenceService: IUpdateTransferenceService;
  let deleteTransferenceService: IDeleteTransferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferenceController],
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
            updateFlagPayed: jest.fn(),
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

    controller = module.get<TransferenceController>(TransferenceController);
    getTransferenceService = module.get<IGetTransferenceService>(
      TYPES.GetTransferenceService,
    );
    insertTransferenceService = module.get<IInsertTransferenceService>(
      TYPES.InsertTransferenceService,
    );
    updateTransferenceService = module.get<IUpdateTransferenceService>(
      TYPES.UpdateTransferenceService,
    );
    deleteTransferenceService = module.get<IDeleteTransferenceService>(
      TYPES.DeleteTransferenceService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(getTransferenceService).toBeDefined();
    expect(insertTransferenceService).toBeDefined();
    expect(updateTransferenceService).toBeDefined();
    expect(deleteTransferenceService).toBeDefined();
  });

  it('should return all transferences', async () => {
    jest
      .spyOn(getTransferenceService, 'getAllTransferencesByUser')
      .mockResolvedValue([transferenceEntityMock]);

    const result = await controller.getAll(
      userPayloadInterfaceMock,
      findTransferenceByQueryParamsDTOMock,
    );

    expect(result.data).toEqual([transferenceEntityMock]);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should return one transference', async () => {
    jest
      .spyOn(getTransferenceService, 'findOne')
      .mockResolvedValue(transferenceEntityMock);

    const result = await controller.getById(1, userPayloadInterfaceMock);

    expect(result.data).toEqual(transferenceEntityMock);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should get transference values group by wallet origin', async () => {
    jest
      .spyOn(getTransferenceService, 'getTransferenceValuesGroupByWallet')
      .mockResolvedValue(getTransferenceValuesGroupByWalletMock);

    const result = await controller.getValuesGroupByOrigin(
      userPayloadInterfaceMock,
      findTransferenceByQueryParamsDTOMock,
    );

    expect(result.data).toEqual(getTransferenceValuesGroupByWalletMock);
    expect(
      getTransferenceService.getTransferenceValuesGroupByWallet,
    ).toHaveBeenCalledWith(
      userPayloadInterfaceMock.userId,
      'origin',
      findTransferenceByQueryParamsDTOMock.start,
      findTransferenceByQueryParamsDTOMock.end,
      findTransferenceByQueryParamsDTOMock.pago,
    );
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should get transference values group by wallet destiny', async () => {
    jest
      .spyOn(getTransferenceService, 'getTransferenceValuesGroupByWallet')
      .mockResolvedValue(getTransferenceValuesGroupByWalletMock);

    const result = await controller.getValuesGroupByDestiny(
      userPayloadInterfaceMock,
      findTransferenceByQueryParamsDTOMock,
    );

    expect(result.data).toEqual(getTransferenceValuesGroupByWalletMock);
    expect(
      getTransferenceService.getTransferenceValuesGroupByWallet,
    ).toHaveBeenCalledWith(
      userPayloadInterfaceMock.userId,
      'destiny',
      findTransferenceByQueryParamsDTOMock.start,
      findTransferenceByQueryParamsDTOMock.end,
      findTransferenceByQueryParamsDTOMock.pago,
    );
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should update flag payed', async () => {
    jest
      .spyOn(updateTransferenceService, 'updateFlagPayed')
      .mockResolvedValue(transferenceEntityMock);

    const result = await controller.updateFlagPayed(
      1,
      { pago: true } as TransferencePatchFlagPayedDTO,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual(transferenceEntityMock);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should update transference', async () => {
    jest
      .spyOn(updateTransferenceService, 'update')
      .mockResolvedValue(transferenceEntityMock);

    const result = await controller.update(
      1,
      transferenceRequestMock,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual(transferenceEntityMock);
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should delete a transference', async () => {
    jest
      .spyOn(deleteTransferenceService, 'delete')
      .mockResolvedValue({ deleted: true } as TransferenceDeleteResponseDTO);

    const result = await controller.delete(1, userPayloadInterfaceMock);

    expect(result.data).toEqual({ deleted: true });
    expect(result.getStatus()).toEqual(HttpStatus.OK);
  });

  it('should insert a new transference', async () => {
    jest
      .spyOn(insertTransferenceService, 'insert')
      .mockResolvedValue(transferenceEntityMock);

    const result = await controller.insert(
      transferenceRequestMock,
      userPayloadInterfaceMock,
    );

    expect(result.data).toEqual(transferenceEntityMock);
    expect(result.getStatus()).toEqual(HttpStatus.CREATED);
  });
});
