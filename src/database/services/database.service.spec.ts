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
      .spyOn(databaseService.queryRunner, 'connect')
      .mockRejectedValue(new ConnectDatabaseException());

    await expect(async () => databaseService.connect()).rejects.toThrowError(
      new ConnectDatabaseException(),
    );
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should start transaction', async () => {
    jest
      .spyOn(databaseService.queryRunner, 'startTransaction')
      .mockResolvedValue(undefined);
    await expect(async () =>
      databaseService.startTransaction(),
    ).not.toThrowError();
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should throw error when start transaction', async () => {
    jest
      .spyOn(databaseService.queryRunner, 'startTransaction')
      .mockRejectedValue(new StartTransactionDatabaseException());
    await expect(async () =>
      databaseService.startTransaction(),
    ).rejects.toThrow(StartTransactionDatabaseException);
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should throw CommitTransactionDatabaseException', async () => {
    jest
      .spyOn(databaseService.queryRunner, 'commitTransaction')
      .mockRejectedValue(new RollbackTransactionDatabaseException());
    await expect(async () =>
      databaseService.commitTransaction(),
    ).rejects.toThrowError();
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should commit transaction', async () => {
    jest
      .spyOn(databaseService.queryRunner, 'commitTransaction')
      .mockResolvedValue(undefined);
    await expect(async () =>
      databaseService.commitTransaction(),
    ).not.toThrowError();
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should rollback transaction', async () => {
    jest
      .spyOn(databaseService.queryRunner, 'rollbackTransaction')
      .mockResolvedValue(undefined);
    expect(
      async () => await databaseService.rollbackTransaction(),
    ).not.toThrowError();
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should throw RollbackTransactionDatabaseException', async () => {
    jest
      .spyOn(databaseService.queryRunner, 'rollbackTransaction')
      .mockRejectedValue(new RollbackTransactionDatabaseException());
    expect(
      async () => await databaseService.rollbackTransaction(),
    ).rejects.toThrowError(RollbackTransactionDatabaseException);
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should save', async () => {
    jest
      .spyOn(databaseService.queryRunner.manager, 'save')
      .mockResolvedValue(Promise.resolve(fakeUserEntity));
    await expect(async () =>
      databaseService.save(fakeUserEntity),
    ).not.toThrowError();
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should throw SaveDatabaseException', async () => {
    jest
      .spyOn(databaseService.queryRunner.manager, 'save')
      .mockRejectedValue(new SaveDatabaseException());
    await expect(async () =>
      databaseService.save(fakeUserEntity),
    ).rejects.toThrow(SaveDatabaseException);
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should release', async () => {
    jest
      .spyOn(databaseService.queryRunner, 'release')
      .mockResolvedValue(undefined);
    await expect(async () => databaseService.release()).not.toThrowError();
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should throw ReleaseTransactionDatabaseException', async () => {
    jest
      .spyOn(databaseService.queryRunner, 'release')
      .mockRejectedValue(new ReleaseTransactionDatabaseException());
    expect(async () => await databaseService.release()).rejects.toThrow(
      ReleaseTransactionDatabaseException,
    );
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should be able delete', async () => {
    jest
      .spyOn(databaseService.queryRunner.manager, 'remove')
      .mockResolvedValue(Promise.resolve([fakeUserEntity]));
    expect(
      async () => await databaseService.delete(fakeUserEntity),
    ).not.toThrowError();
    expect(databaseService.queryRunner).toBeDefined();
  });

  it('should throw RemoveDatabaseException', async () => {
    jest
      .spyOn(databaseService.queryRunner.manager, 'remove')
      .mockRejectedValue(new RemoveDatabaseException());
    expect(
      async () => await databaseService.delete(fakeUserEntity),
    ).rejects.toThrow(RemoveDatabaseException);
    expect(databaseService.queryRunner).toBeDefined();
  });
});
