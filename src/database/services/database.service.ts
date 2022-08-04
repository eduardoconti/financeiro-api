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
    } catch (err: any) {
      throw new ConnectDatabaseException(err.message ?? '', err);
    }
  };

  public startTransaction = async (): Promise<void> => {
    try {
      await this.queryRunner.startTransaction();
    } catch (err: any) {
      throw new StartTransactionDatabaseException(err.message ?? '', err);
    }
  };

  public commitTransaction = async (): Promise<void> => {
    try {
      await this.queryRunner.commitTransaction();
    } catch (err: any) {
      throw new CommitTransactionDatabaseException(err.message ?? '', err);
    }
  };

  public rollbackTransaction = async (): Promise<void> => {
    try {
      await this.queryRunner.rollbackTransaction();
    } catch (err: any) {
      throw new RollbackTransactionDatabaseException(err.message ?? '', err);
    }
  };

  public release = async (): Promise<void> => {
    try {
      await this.queryRunner.release();
      //this.queryRunner = undefined;
    } catch (err: any) {
      throw new ReleaseTransactionDatabaseException(err.message ?? '', err);
    }
  };

  public save = async <E>(entity: E): Promise<E> => {
    try {
      const result = await this.queryRunner.manager.save<E>(entity);
      return result as E;
    } catch (err: any) {
      throw new SaveDatabaseException(err.message ?? '', err);
    }
  };

  public delete = async <E>(entity: E): Promise<E> => {
    try {
      await this.queryRunner.manager.remove<E>(entity);
      return entity as E;
    } catch (err: any) {
      throw new RemoveDatabaseException(err.message ?? '', err);
    }
  };
}
