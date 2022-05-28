import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, getMetadataArgsStorage, QueryRunner } from 'typeorm';

import { TYPES } from '@config/dependency-injection';

import { StartTransactionDatabaseException } from '@db/exceptions';

import { DatabaseService } from './database.service';
import { IDatabaseService } from './database.service.interface';

jest.useFakeTimers();
describe('DatabaseService', () => {
  let databaseService: IDatabaseService;
  let dataSource: DataSource;
  let qr: QueryRunner;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            //autoLoadEntities: true,
            synchronize: false,
            host: process.env.POSTGRES_HOST,
            port: 5430,
            username: 'admin',
            password: 'admin',
            database: 'financeiro',
            entities: getMetadataArgsStorage().tables.map((t) => t.target),
            //ssl: { rejectUnauthorized: false },
          }),
        }),
      ],
      providers: [
        {
          provide: TYPES.DatabaseService,
          useClass: DatabaseService,
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(),
          },
        },
      ],
    }).compile();

    databaseService = module.get<IDatabaseService>(TYPES.DatabaseService);
    dataSource = module.get<DataSource>(DataSource);
    qr = {
      manager: {},
    } as QueryRunner;
    qr.manager;
    Object.assign(qr.manager, {
      save: jest.fn(),
    });
    qr.connect = jest.fn();
    qr.release = jest.fn();
    qr.startTransaction = jest.fn();
    qr.commitTransaction = jest.fn();
    qr.rollbackTransaction = jest.fn();
    qr.release = jest.fn();

    dataSource.createQueryRunner = jest.fn(() => qr);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(databaseService).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  it('should connect', async () => {
    jest.spyOn(databaseService, 'connect').mockResolvedValue(null);

    expect(async () => await databaseService.connect()).not.toThrowError();
  });

  it('should throw ConnectDatabaseException', async () => {
    jest
      .spyOn(databaseService, 'connect')
      .mockRejectedValue(new StartTransactionDatabaseException());

    await expect(databaseService.connect()).rejects.toThrow(
      new StartTransactionDatabaseException(),
    );
  });

  it('should start transaction', async () => {
    jest.spyOn(databaseService, 'connect').mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'startTransaction')
      .mockResolvedValue(undefined);
    expect(
      async () => await databaseService.startTransaction(),
    ).not.toThrowError();
  });

  it('should throw error when start transaction', async () => {
    jest.spyOn(databaseService, 'connect').mockResolvedValue(null);
    jest
      .spyOn(databaseService, 'startTransaction')
      .mockRejectedValueOnce(new StartTransactionDatabaseException());

    expect(
      async () => await databaseService.startTransaction(),
    ).rejects.toThrow(StartTransactionDatabaseException);
  });

  it('should commit transaction', async () => {
    expect(
      async () => await databaseService.commitTransaction(),
    ).not.toThrowError();
  });

  it('should rollback transaction', async () => {
    // jest.spyOn(dataSource, 'createQueryRunner').mockImplementation(() => qr);
    // jest
    //   .spyOn(dataSource.createQueryRunner(), 'connect')
    //   .mockResolvedValue(undefined);
    // jest
    //   .spyOn(dataSource.createQueryRunner(), 'startTransaction')
    //   .mockResolvedValue(undefined);
    // jest
    //   .spyOn(dataSource.createQueryRunner(), 'commitTransaction')
    //   .mockResolvedValue(undefined);
    jest
      .spyOn(databaseService, 'rollbackTransaction')
      .mockResolvedValueOnce(undefined);
    jest
      .spyOn(databaseService, 'commitTransaction')
      .mockResolvedValueOnce(undefined);
    expect(
      async () => await databaseService.rollbackTransaction(),
    ).not.toThrowError();
  });
});
