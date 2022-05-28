import { QueryRunner } from 'typeorm';

export interface IDatabaseService {
  connect: () => Promise<any>;
  startTransaction: () => Promise<void>;
  commitTransaction: () => Promise<void>;
  rollbackTransaction: () => Promise<void>;
  release: () => Promise<void>;
  save: <E>(entity: E) => Promise<E>;
  queryRunner: QueryRunner;
}
