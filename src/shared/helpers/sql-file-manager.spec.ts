import * as fs from 'fs';

import { SqlFileNotFound } from '@config/exceptions';

import { SqlFileManager } from './sql-file-manager';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));
describe('SqlFileManager', () => {
  it('should be defined', () => {
    expect(SqlFileManager).toBeDefined();
  });
  it('should be able to readFile', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('select * from expense');
    const sqlFile = SqlFileManager.readFile('dir', 'sqlFilePath');
    expect(sqlFile).toBeDefined();
    expect(sqlFile).toEqual('select * from expense');
  });

  it('should be throw SqlFileNotFound', () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new SqlFileNotFound();
    });
    expect(() => SqlFileManager.readFile('dir', 'sqlFilePath')).toThrow(
      SqlFileNotFound,
    );
  });
});
