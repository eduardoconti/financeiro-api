import { Test } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';

import { UserDTO } from '@users/dto';
import { Users } from '@users/entity';

import { TYPES } from '@config/dependency-injection';

import {
  ConnectDatabaseException,
  ReleaseTransactionDatabaseException,
  RemoveDatabaseException,
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
  //let qr: QueryRunner;
  const qr = {
    manager: {},
  } as QueryRunner;
  qr.manager;
  Object.assign(qr.manager, {
    save: jest.fn(),
    remove: jest.fn(),
  });
  qr.connect = jest.fn();
  qr.release = jest.fn();
  qr.startTransaction = jest.fn();
  qr.commitTransaction = jest.fn();
  qr.rollbackTransaction = jest.fn();
  qr.release = jest.fn();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.DatabaseService,
          useClass: DatabaseService,
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => qr),
          },
        },
      ],
    }).compile();

    databaseService = module.get<IDatabaseService>(TYPES.DatabaseService);
    dataSource = module.get<DataSource>(DataSource);
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
      .spyOn(databaseService.queryRunner as QueryRunner, 'connect')
      .mockRejectedValue(new ConnectDatabaseException());

    await expect(async () => databaseService.connect()).rejects.toThrowError(
      new ConnectDatabaseException(),
    );
  });

  it('should start transaction', async () => {
    jest
      .spyOn(databaseService.queryRunner as QueryRunner, 'startTransaction')
      .mockResolvedValue(undefined);
    await expect(async () =>
      databaseService.startTransaction(),
    ).not.toThrowError();
  });

  it('should throw error when start transaction', async () => {
    jest
      .spyOn(databaseService.queryRunner as QueryRunner, 'startTransaction')
      .mockRejectedValue(new StartTransactionDatabaseException());

    //await databaseService.connect();
    await expect(async () =>
      databaseService.startTransaction(),
    ).rejects.toThrow(StartTransactionDatabaseException);
  });

  it('should throw CommitTransactionDatabaseException', async () => {
    jest
      .spyOn(databaseService.queryRunner as QueryRunner, 'commitTransaction')
      .mockRejectedValue(new RollbackTransactionDatabaseException());
    await expect(async () =>
      databaseService.commitTransaction(),
    ).rejects.toThrowError();
  });

  it('should commit transaction', async () => {
    jest
      .spyOn(databaseService.queryRunner as QueryRunner, 'commitTransaction')
      .mockResolvedValue(undefined);
    await expect(async () =>
      databaseService.commitTransaction(),
    ).not.toThrowError();
  });

  it('should rollback transaction', async () => {
    jest
      .spyOn(databaseService.queryRunner as QueryRunner, 'rollbackTransaction')
      .mockResolvedValue(undefined);
    expect(
      async () => await databaseService.rollbackTransaction(),
    ).not.toThrowError();
  });

  it('should throw RollbackTransactionDatabaseException', async () => {
    jest
      .spyOn(databaseService.queryRunner as QueryRunner, 'rollbackTransaction')
      .mockRejectedValue(new RollbackTransactionDatabaseException());
    expect(
      async () => await databaseService.rollbackTransaction(),
    ).rejects.toThrowError(RollbackTransactionDatabaseException);
  });

  it('should save', async () => {
    jest
      .spyOn((databaseService.queryRunner as QueryRunner).manager, 'save')
      .mockResolvedValue(Promise.resolve(fakeUserEntity));
    await expect(async () =>
      databaseService.save(fakeUserEntity),
    ).not.toThrowError();
  });

  it('should throw SaveDatabaseException', async () => {
    jest
      .spyOn((databaseService.queryRunner as QueryRunner).manager, 'save')
      .mockRejectedValue(new SaveDatabaseException());
    await expect(async () =>
      databaseService.save(fakeUserEntity),
    ).rejects.toThrow(SaveDatabaseException);
  });

  it('should release', async () => {
    jest
      .spyOn(databaseService.queryRunner as QueryRunner, 'release')
      .mockResolvedValue(undefined);
    await expect(async () => databaseService.release()).not.toThrowError();
  });

  it('should throw ReleaseTransactionDatabaseException', async () => {
    jest
      .spyOn(databaseService.queryRunner as QueryRunner, 'release')
      .mockRejectedValue(new ReleaseTransactionDatabaseException());
    expect(async () => await databaseService.release()).rejects.toThrow(
      ReleaseTransactionDatabaseException,
    );
  });

  it('should be able delete', async () => {
    jest
      .spyOn((databaseService.queryRunner as QueryRunner).manager, 'remove')
      .mockResolvedValue(Promise.resolve([fakeUserEntity]));
    expect(
      async () => await databaseService.delete(fakeUserEntity),
    ).not.toThrowError();
  });

  it('should throw RemoveDatabaseException', async () => {
    jest
      .spyOn((databaseService.queryRunner as QueryRunner).manager, 'remove')
      .mockRejectedValue(new RemoveDatabaseException());
    expect(
      async () => await databaseService.delete(fakeUserEntity),
    ).rejects.toThrow(RemoveDatabaseException);
  });
});
