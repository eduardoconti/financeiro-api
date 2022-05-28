import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

//import { DespesasDTO } from '@expense/dto';
import { Despesas } from '@expense/entity';
import { IExpenseRepository } from '@expense/repository';

import { InsertExpenseService } from './insert-expense.service';
import { IInsertExpenseService } from './insert-expense.service.interface';

//const mockExpenseRequest = new DespesasDTO();
const fakeUserId = '6fdeff33-a45d-4e51-b6f0-b7e695f72089';

const mockExpenseEntity = Despesas.build({
  id: 1,
  userId: fakeUserId,
  descricao: 'Teste',
  valor: 100,
  carteiraId: 1,
  categoriaId: 1,
  instalment: 1,
  createdAt: new Date('2022-05-26T18:59:18.026Z'),
});
describe('InsertExpenseService', () => {
  let insertExpenseService: IInsertExpenseService;
  let expenseRepository: IExpenseRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.ExpenseRepository,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(),
          },
        },
        {
          provide: TYPES.InsertExpenseService,
          useClass: InsertExpenseService,
        },
      ],
    }).compile();

    insertExpenseService = module.get<IInsertExpenseService>(
      TYPES.InsertExpenseService,
    );
    expenseRepository = module.get<IExpenseRepository>(TYPES.ExpenseRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(insertExpenseService).toBeDefined();
    expect(expenseRepository).toBeDefined();
  });

  it('should insert a new expense', async () => {
    jest
      .spyOn(expenseRepository, 'insert')
      .mockResolvedValue(mockExpenseEntity);
    const data = await insertExpenseService.insert(
      mockExpenseEntity,
      fakeUserId,
    );

    expect(data).toBeDefined();
    expect(data).toEqual(mockExpenseEntity);
  });
});
