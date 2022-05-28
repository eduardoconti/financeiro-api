import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

import {
  CommitTransactionDatabaseException,
  ConnectDatabaseException,
  ReleaseTransactionDatabaseException,
  RollbackTransactionDatabaseException,
  SaveDatabaseException,
  StartTransactionDatabaseException,
} from '@db/exceptions';

import { IDatabaseService } from './database.service.interface';

@Injectable()
export class DatabaseService implements IDatabaseService {
  private queryRunner: QueryRunner;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner();
  }

  public connect = async (): Promise<any> => {
    try {
      return await this.getQueryRunner().connect();
    } catch (error) {
      throw new ConnectDatabaseException(undefined, error);
    }
  };

  public startTransaction = async (): Promise<void> => {
    try {
      await await this.getQueryRunner().startTransaction();
    } catch (error) {
      console.log(error);
      throw new StartTransactionDatabaseException(undefined, error);
    }
  };

  public commitTransaction = async (): Promise<void> => {
    try {
      await this.queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      throw new CommitTransactionDatabaseException(undefined, error);
    }
  };

  public rollbackTransaction = async (): Promise<void> => {
    try {
      await this.getQueryRunner().rollbackTransaction();
    } catch (error) {
      console.log(this.queryRunner);
      console.log(error);
      throw new RollbackTransactionDatabaseException(undefined, error);
    }
  };

  public release = async (): Promise<void> => {
    try {
      await this.queryRunner.release();
    } catch (error) {
      throw new ReleaseTransactionDatabaseException(undefined, error);
    }
  };

  public save = async <E>(entity: E): Promise<E> => {
    try {
      const result = await this.queryRunner?.manager.save<E>(entity);

      return result as E;
    } catch (err) {
      throw new SaveDatabaseException(undefined, err);
    }
  };

  private getQueryRunner = (): QueryRunner => {
    return this.queryRunner ?? this.dataSource.createQueryRunner();
  };
}