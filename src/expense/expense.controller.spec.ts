import { ExecutionContext, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { JwtAuthGuard } from '@auth/guard';

import { AppModule } from '@app/app.module';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '@db/database.module';

import { ValidationPipe } from '@shared/pipes';

import { ExpenseController } from './expense.controller';
import { DespesasModule } from './expense.module';
import { fakeInsertExpenseRequest, mockExpenseEntity } from './mocks';
import {
  IDeleteExpenseService,
  IGetExpenseService,
  IInsertExpenseService,
  IUpdateExpenseService,
} from './service';

describe('ExpenseController', () => {
  let expenseController: ExpenseController;
  let updateExpenseService: IUpdateExpenseService;
  let getExpenseService: IGetExpenseService;
  let insertExpenseService: IInsertExpenseService;
  let deleteExpenseService: IDeleteExpenseService;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: TYPES.UpdateExpenseService,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: TYPES.GetExpenseService,
          useValue: {
            getAllExpensesByUser: jest.fn(),
            getTotalExpenses: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertExpenseService,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: TYPES.DeleteExpenseService,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(),
      })
      .compile();

    // app = module.createNestApplication();
    // app.useGlobalPipes(new ValidationPipe());
    // await app.init();
    // console.log(app);

    expenseController = module.get(ExpenseController);
    updateExpenseService = module.get<IUpdateExpenseService>(
      TYPES.UpdateExpenseService,
    );
    getExpenseService = module.get<IGetExpenseService>(TYPES.GetExpenseService);
    insertExpenseService = module.get<IInsertExpenseService>(
      TYPES.InsertExpenseService,
    );
    deleteExpenseService = module.get<IDeleteExpenseService>(
      TYPES.DeleteExpenseService,
    );
  });

  it('should be defined', () => {
    expect(expenseController).toBeDefined();
    expect(updateExpenseService).toBeDefined();
    expect(getExpenseService).toBeDefined();
    expect(insertExpenseService).toBeDefined();
    expect(deleteExpenseService).toBeDefined();
  });

  it('should be insert a new expense', () => {
    // jest
    //   .spyOn(insertExpenseService, 'insert')
    //   .mockResolvedValue(mockExpenseEntity);
    return request(app.getHttpServer())
      .post('expense')
      .send(fakeInsertExpenseRequest)
      .expect(500);
    //console.log(data);
    // const { data } = await expenseController.insertExpense(
    //   fakeInsertExpenseRequest,
    //   {
    //     userId: 'userId',
    //     userName: 'userName',
    //     userProfile: 1,
    //   },
    // );
    // expect(data).toBeDefined();
    // expect(data).toEqual(mockExpenseEntity);
  });
});
