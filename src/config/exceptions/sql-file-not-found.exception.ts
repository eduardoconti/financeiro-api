import { InternalServerErrorException } from '.';
export type SqlDataType = {
  fileName: string;
};
export class SqlFileNotFound extends InternalServerErrorException {
  constructor(data?: SqlDataType) {
    super(undefined, 'SQL não encontrado!', undefined, data);
  }
}
