import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, getMetadataArgsStorage, QueryRunner } from 'typeorm';

import { UserDTO } from '@users/dto';
import { Users } from '@users/entity';

import { TYPES } from '@config/dependency-injection';

import {
  ReleaseTransactionDatabaseException,
  RollbackTransactionDatabaseException,
  SaveDatabaseException,
  StartTransactionDatabaseException,
} from '@db/exceptions';

import { DatabaseService } from './database.service';
import { IDatabaseService } from './database.service.interface';

jest.useFakeTimers();
const fakeUserDTO: UserDTO = new UserDTO();
fakeUserDTO.login = 'test';
fakeUserDTO.nome = 'test';
fakeUserDTO.password = 'test';
fakeUserDTO.status = 1;
fakeUserDTO.perfil = 1;

const fakeUserEntity: Users = Users.build(fakeUserDTO);
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
    databaseService.queryRunner = qr;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(databaseService).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  it('should connect', async () => {
    jest
      .spyOn(dataSource.createQueryRunner(), 'connect')
      .mockResolvedValue(undefined);

    expect(async () => await databaseService.connect()).not.toThrowError();
  });

  it('should throw ConnectDatabaseException', async () => {
    jest
      .spyOn(dataSource.createQueryRunner(), 'connect')
      .mockRejectedValue(new StartTransactionDatabaseException());

    await expect(databaseService.connect()).rejects.toThrow(
      new StartTransactionDatabaseException(),
    );
  });

  it('should start transaction', async () => {
    jest
      .spyOn(dataSource.createQueryRunner(), 'startTransaction')
      .mockResolvedValue(undefined);
    expect(
      async () => await databaseService.startTransaction(),
    ).not.toThrowError();
  });

  it('should throw error when start transaction', async () => {
    jest
      .spyOn(dataSource.createQueryRunner(), 'startTransaction')
      .mockRejectedValue(new StartTransactionDatabaseException());

    expect(
      async () => await databaseService.startTransaction(),
    ).rejects.toThrow(StartTransactionDatabaseException);
  });

  it('should throw CommitTransactionDatabaseException', async () => {
    jest
      .spyOn(dataSource.createQueryRunner(), 'commitTransaction')
      .mockRejectedValue(new RollbackTransactionDatabaseException());
    await expect(async () =>
      databaseService.commitTransaction(),
    ).rejects.toThrowError();
  });

  it('should commit transaction', async () => {
    jest
      .spyOn(dataSource.createQueryRunner(), 'commitTransaction')
      .mockResolvedValue(Promise.resolve());
    await expect(async () =>
      databaseService.commitTransaction(),
    ).not.toThrowError();
  });

  it('should rollback transaction', async () => {
    jest
      .spyOn(dataSource.createQueryRunner(), 'rollbackTransaction')
      .mockResolvedValue(Promise.resolve());
    await expect(async () =>
      databaseService.rollbackTransaction(),
    ).not.toThrowError();
  });

  it('should throw RollbackTransactionDatabaseException', async () => {
    jest
      .spyOn(dataSource.createQueryRunner(), 'rollbackTransaction')
      .mockRejectedValue(new RollbackTransactionDatabaseException());
    await expect(async () =>
      databaseService.rollbackTransaction(),
    ).rejects.toThrowError();
  });

  it('should save', async () => {
    jest
      .spyOn(dataSource.createQueryRunner().manager, 'save')
      .mockResolvedValue(Promise.resolve(fakeUserEntity));
    expect(
      async () => await databaseService.save(fakeUserEntity),
    ).not.toThrowError();
  });

  it('should throw SaveDatabaseException', async () => {
    jest
      .spyOn(dataSource.createQueryRunner().manager, 'save')
      .mockRejectedValue(new SaveDatabaseException());
    await expect(
      async () => await databaseService.save(fakeUserEntity),
    ).rejects.toThrow(SaveDatabaseException);
  });

  it('should release', async () => {
    jest
      .spyOn(dataSource.createQueryRunner(), 'release')
      .mockResolvedValue(Promise.resolve());
    await expect(async () => databaseService.release()).not.toThrowError();
  });

  it('should throw ReleaseTransactionDatabaseException', async () => {
    jest
      .spyOn(dataSource.createQueryRunner(), 'release')
      .mockRejectedValue(new ReleaseTransactionDatabaseException());
    await expect(async () => await databaseService.release()).rejects.toThrow(
      ReleaseTransactionDatabaseException,
    );
  });
});
