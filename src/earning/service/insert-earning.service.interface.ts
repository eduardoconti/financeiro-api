import { ReceitasDTO } from '@earning/dto';
import { Earning } from '@earning/entity';

export interface IInsertEarningService {
  insert(earning: ReceitasDTO, userId: string): Promise<Earning>;
}
