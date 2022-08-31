import { Test } from '@nestjs/testing';

import { IGetCategoryService } from '@category/service';

import { IGetWalletService } from '@wallet/service';

import { TYPES } from '@config/dependency-injection';

import { IDatabaseService } from '@db/services';

import {
  ExpenseNotFoundException,
  UpdateExpenseException,
  UpdateInstalmentException,
} from '@expense/exceptions';
import {
  fakeInsertExpenseRequest,
  fakeInsertExpenseRequestWithInstalment,
  mockExpenseEntity,
  mockExpenseInstalment,
} from '@expense/mocks';
import { IExpenseRepository } from '@expense/repository';

import { DateHelper } from '@shared/helpers';

import { UpdateExpenseService } from './update-expense.service';
import { IUpdateExpenseService } from './update-expense.service.interface';

jest.mock('@shared/helpers', () => ({
  DateHelper: {
    dateNow: () => new Date('2022-05-26T18:59:18.026Z'),
    addMonth: () => new Date('2022-05-26T18:59:18.026Z'),
    date: (date: string | Date) => new Date(date),
  },
}));
describe('UpdateExpenseService', () => {
  let updateExpenseService: IUpdateExpenseService;
  let expenseRepository: IExpenseRepository;
  let getWalletService: IGetWalletService;
  let getCategoryService: IGetCategoryService;
  let databaseService: IDatabaseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.ExpenseRepository,
          useValue: {
            findOneByParams: jest.fn(),
            update: jest.fn(),
            findByParams: jest.fn(),
          },
        },
        {
          provide: TYPES.GetCategoryService,
          useValue: {
            findCategoryUserById: jest.fn(),
          },
        },
        {
          provide: TYPES.GetWalletService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateExpenseService,
          useClass: UpdateExpenseService,
        },
        {
          provide: TYPES.DatabaseService,
          useValue: {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    updateExpenseService = module.get<UpdateExpenseService>(
      TYPES.UpdateExpenseService,
    );
    expenseRepository = module.get<IExpenseRepository>(TYPES.ExpenseRepository);
    getWalletService = module.get<IGetWalletService>(TYPES.GetWalletService);
    getCategoryService = module.get<IGetCategoryService>(
      TYPES.GetCategoryService,
    );
    databaseService = module.get<IDatabaseService>(TYPES.DatabaseService);
  });

  it('should be defined', () => {
    expect(updateExpenseService).toBeDefined();
    expect(expenseRepository).toBeDefined();
    expect(getWalletService).toBeDefined();
    expect(getCategoryService).toBeDefined();
    expect(databaseService).toBeDefined();
  });

  it('should update an expense', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseEntity);
    jest
      .spyOn(expenseRepository, 'update')
      .mockResolvedValue(mockExpenseEntity);

    const data = await updateExpenseService.update(
      mockExpenseEntity.id as number,
      mockExpenseEntity.userId,
      fakeInsertExpenseRequest,
    );

    expect(data).toBeDefined();
    expect(data).toEqual(mockExpenseEntity);
  });

  it('should throw ExpenseNotFoundException', async () => {
    jest.spyOn(expenseRepository, 'findOneByParams').mockResolvedValue(null);

    await expect(
      updateExpenseService.update(
        mockExpenseEntity.id as number,
        mockExpenseEntity.userId,
        fakeInsertExpenseRequest,
      ),
    ).rejects.toThrowError(ExpenseNotFoundException);
  });

  it('should throw UpdateInstalmentException when a expense with instalment is updated', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseInstalment);

    await expect(
      updateExpenseService.update(
        mockExpenseEntity.id as number,
        mockExpenseEntity.userId,
        fakeInsertExpenseRequestWithInstalment,
      ),
    ).rejects.toThrowError(UpdateInstalmentException);
  });

  it('should throw UpdateExpenseException when try update number of instalment', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseEntity);

    await expect(
      updateExpenseService.update(
        mockExpenseEntity.id as number,
        mockExpenseEntity.userId,
        {
          ...fakeInsertExpenseRequest,
          instalment: 2,
        },
      ),
    ).rejects.toThrowError(UpdateExpenseException);
  });

  it('should throw UpdateExpenseException when payment date and flag not payed', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseEntity);

    await expect(
      updateExpenseService.update(
        mockExpenseEntity.id as number,
        mockExpenseEntity.userId,
        {
          ...fakeInsertExpenseRequest,
          pagamento: new Date('2022-05-26T18:59:18.026Z'),
          pago: false,
        },
      ),
    ).rejects.toThrowError(UpdateExpenseException);
  });

  it('should throw UpdateExpenseException when not payment date and flag payed', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseEntity);

    await expect(
      updateExpenseService.update(
        mockExpenseEntity.id as number,
        mockExpenseEntity.userId,
        {
          ...fakeInsertExpenseRequest,
          pago: true,
        },
      ),
    ).rejects.toThrowError(UpdateExpenseException);
  });

  it('should update paymenta date of expense payed', async () => {
    jest.spyOn(expenseRepository, 'findOneByParams').mockResolvedValue({
      ...mockExpenseEntity,
      pago: true,
      pagamento: DateHelper.date('2022-05-26T18:59:18.026Z'),
    });
    jest.spyOn(expenseRepository, 'update').mockResolvedValue({
      ...mockExpenseEntity,
      pago: true,
      pagamento: DateHelper.date('2022-05-25T18:59:18.026Z'),
      updatedAt: DateHelper.dateNow(),
    });

    const data = await updateExpenseService.update(
      mockExpenseEntity.id as number,
      mockExpenseEntity.userId,
      {
        ...fakeInsertExpenseRequest,
        pago: true,
        pagamento: DateHelper.date('2022-05-25T18:59:18.026Z'),
      },
    );

    expect(data).toBeDefined();
    expect(data).toEqual({
      ...mockExpenseEntity,
      pago: true,
      pagamento: DateHelper.date('2022-05-25T18:59:18.026Z'),
      updatedAt: DateHelper.dateNow(),
    });
    expect(expenseRepository.update).toBeCalledWith(mockExpenseEntity.id, {
      ...fakeInsertExpenseRequest,
      updatedAt: DateHelper.dateNow(),
      pagamento: DateHelper.date('2022-05-25T18:59:18.026Z'),
      pago: true,
    });
  });

  it('should update flag payed', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseEntity);
    jest
      .spyOn(expenseRepository, 'update')
      .mockResolvedValue({ ...mockExpenseEntity, pago: true });

    const data = await updateExpenseService.updateFlagPayed(
      mockExpenseEntity.id as number,
      mockExpenseEntity.userId,
      {
        pago: true,
      },
    );

    expect(data).toBeDefined();
    expect(data).toEqual({ ...mockExpenseEntity, pago: true });
  });

  it('should update flag payed to false', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue({ ...mockExpenseEntity, pago: true });
    jest
      .spyOn(expenseRepository, 'update')
      .mockResolvedValue({ ...mockExpenseEntity, pago: false });

    const data = await updateExpenseService.updateFlagPayed(
      mockExpenseEntity.id as number,
      mockExpenseEntity.userId,
      {
        pago: false,
      },
    );

    expect(data).toBeDefined();
    expect(data).toEqual({
      ...mockExpenseEntity,
      pago: false,
      pagamento: undefined,
    });
  });

  it('it shoould throw ExpenseNotFoundException when try update flag payed', async () => {
    jest.spyOn(expenseRepository, 'findOneByParams').mockResolvedValue(null);

    await expect(
      updateExpenseService.updateFlagPayed(
        mockExpenseEntity.id as number,
        mockExpenseEntity.userId,
        {
          pago: true,
        },
      ),
    ).rejects.toThrowError(ExpenseNotFoundException);
  });

  it('should return expense when flag payed is the same in database', async () => {
    jest
      .spyOn(expenseRepository, 'findOneByParams')
      .mockResolvedValue(mockExpenseEntity);
    jest
      .spyOn(expenseRepository, 'update')
      .mockResolvedValue(mockExpenseEntity);

    const data = await updateExpenseService.updateFlagPayed(
      mockExpenseEntity.id as number,
      mockExpenseEntity.userId,
      {
        pago: false,
      },
    );

    expect(data).toBeDefined();
    expect(data).toEqual(mockExpenseEntity);
  });
});
