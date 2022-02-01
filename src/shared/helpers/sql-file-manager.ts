import { readFileSync } from 'fs';
import { join } from 'path';

import { SqlFileNotFound } from '@config/exceptions';

export class SqlFileManager {
  static readFile = (dir: string, fileName: string): string => {
    try {
      const sqlDir = join(dir, '../config/sql/');
      return readFileSync(sqlDir + fileName).toString();
    } catch (error) {
      throw new SqlFileNotFound({ fileName });
    }
  };
}
