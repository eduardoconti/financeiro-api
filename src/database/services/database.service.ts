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
  queryRunner!: QueryRunner;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public connect = async (): Promise<any> => {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      await this.queryRunner.connect();
    } catch (error) {
      throw new ConnectDatabaseException(undefined, error);
    }
  };

  public startTransaction = async (): Promise<void> => {
    try {
      await this.queryRunner.startTransaction();
    } catch (error) {
      throw new StartTransactionDatabaseException(undefined, error);
    }
  };

  public commitTransaction = async (): Promise<void> => {
    try {
      await this.queryRunner.commitTransaction();
    } catch (error) {
      throw new CommitTransactionDatabaseException(undefined, error);
    }
  };

  public rollbackTransaction = async (): Promise<void> => {
    try {
      await this.queryRunner.rollbackTransaction();
    } catch (error) {
      throw new RollbackTransactionDatabaseException(undefined, error);
    }
  };

  public release = async (): Promise<void> => {
    try {
      await this.queryRunner.release();
      //this.queryRunner = undefined;
    } catch (error) {
      throw new ReleaseTransactionDatabaseException(undefined, error);
    }
  };

  public save = async <E>(entity: E): Promise<E> => {
    try {
      const result = await this.queryRunner.manager.save<E>(entity);
      return result as E;
    } catch (err) {
      throw new SaveDatabaseException(undefined, err);
    }
  };

  public delete = async <E>(entity: E): Promise<E> => {
    try {
      await this.queryRunner.manager.remove<E>(entity);
      return entity as E;
    } catch (err) {
      throw new RemoveDatabaseException(undefined, err);
    }
  };
}
