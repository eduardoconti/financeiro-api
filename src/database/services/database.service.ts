import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

import {
  CommitTransactionDatabaseException,
  ConnectDatabaseException,
  ReleaseTransactionDatabaseException,
  RemoveDatabaseException,
  RollbackTransactionDatabaseException,
  SaveDatabaseException,
  StartTransactionDatabaseException,
} from '@db/exceptions';

import { IDatabaseService } from './database.service.interface';

@Injectable()
export class DatabaseService implements IDatabaseService {
  private _queryRunner!: QueryRunner;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  get queryRunner() {
    if (this._queryRunner) return this._queryRunner;

    this._queryRunner = this.dataSource.createQueryRunner();
    return this._queryRunner;
  }

  public connect = async (): Promise<any> => {
    try {
      await this.queryRunner.connect();
    } catch (err: any) {
      throw new ConnectDatabaseException(err.message ?? 'connect error', err);
    }
  };

  public startTransaction = async (): Promise<void> => {
    try {
      await this.queryRunner.startTransaction();
    } catch (err: any) {
      throw new StartTransactionDatabaseException(
        err.message ?? 'start transacion error',
        err,
      );
    }
  };

  public commitTransaction = async (): Promise<void> => {
    try {
      await this.queryRunner.commitTransaction();
    } catch (err: any) {
      throw new CommitTransactionDatabaseException(
        err.message ?? 'commit transaction error',
        err,
      );
    }
  };

  public rollbackTransaction = async (): Promise<void> => {
    try {
      await this.queryRunner.rollbackTransaction();
    } catch (err: any) {
      throw new RollbackTransactionDatabaseException(
        err.message ?? 'rollback transaction error',
        err,
      );
    }
  };

  public release = async (): Promise<void> => {
    try {
      await this.queryRunner.release();
    } catch (err: any) {
      throw new ReleaseTransactionDatabaseException(
        err.message ?? 'release error',
        err,
      );
    }
  };

  public save = async <E>(entity: E): Promise<E> => {
    try {
      const result = await this.queryRunner.manager.save<E>(entity);
      return result as E;
    } catch (err: any) {
      throw new SaveDatabaseException(err.message ?? 'save error', err);
    }
  };

  public delete = async <E>(entity: E): Promise<E> => {
    try {
      await this.queryRunner.manager.remove<E>(entity);
      return entity as E;
    } catch (err: any) {
      throw new RemoveDatabaseException(err.message ?? 'delete error', err);
    }
  };
}
